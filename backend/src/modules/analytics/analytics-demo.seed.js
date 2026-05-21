const { Order } = require("../orders/order.model");
const { Product } = require("../products/product.model");
const { ProductDailyStat } = require("./product-daily-stat.model");

const DEMO_EMAIL = "demo-analytics@royalorchard.seed";

function utcMidnight(d) {
  const x = new Date(d);
  x.setUTCHours(0, 0, 0, 0);
  return x;
}

const STATUSES = ["Delivered", "Delivered", "Delivered", "Shipped", "Processing", "Placed", "Returned", "Cancelled"];
const RETURN_REASONS = ["damaged", "wrong_item", "quality_issue", "other"];

async function seedAnalyticsDemo() {
  const existing = await Order.countDocuments({ "guest.email": DEMO_EMAIL });
  if (existing > 0) return;

  const products = await Product.find({ isActive: true }).limit(6).lean();
  if (!products.length) return;

  const now = new Date();
  const orders = [];

  for (let dayOffset = 29; dayOffset >= 0; dayOffset -= 1) {
    const day = new Date(now);
    day.setDate(day.getDate() - dayOffset);
    const ordersPerDay = 1 + (dayOffset % 4);
    for (let i = 0; i < ordersPerDay; i += 1) {
      const product = products[(dayOffset + i) % products.length];
      const weight = product.weights?.[0] ? Number.parseInt(String(product.weights[0]), 10) || 3 : 3;
      const unitPrice = product.weightPrices?.[`${weight}kg`] || product.weightPrices?.["3kg"] || 4500;
      const qty = 1 + ((dayOffset + i) % 2);
      const subtotal = unitPrice * qty;
      const shipping = subtotal > 5000 ? 0 : 350;
      const tax = Math.round(subtotal * 0.05);
      const total = subtotal + shipping + tax;
      const status = STATUSES[(dayOffset + i) % STATUSES.length];
      const createdAt = new Date(day);
      createdAt.setHours(9 + (i % 8), (i * 11) % 60, 0, 0);

      const order = {
        guest: { name: "Demo Analytics Customer", email: DEMO_EMAIL },
        items: [
          {
            product: product._id,
            title: product.name,
            image: Array.isArray(product.images) ? product.images[0] : "",
            weight,
            quantity: qty,
            price: unitPrice,
          },
        ],
        deliveryDetails: {
          name: "Demo Analytics Customer",
          phone: "+92 300 0000000",
          address: "Royal Orchard Demo Lane, Karachi",
        },
        paymentMethod: "COD",
        paymentStatus: status === "Delivered" ? "Paid" : "Pending",
        paymentGateway: "COD",
        orderStatus: status,
        pricing: { subtotal, shipping, tax, total },
        timeline: [{ status: "Placed", date: createdAt }],
        createdAt,
        updatedAt: createdAt,
      };

      if (status === "Returned") {
        order.returned = true;
        order.returnReason = RETURN_REASONS[(dayOffset + i) % RETURN_REASONS.length];
        order.returnRequest = { status: "Approved", reason: order.returnReason };
      }
      if (status === "Delivered") {
        order.deliveredDate = new Date(createdAt.getTime() + 2 * 86400000);
        order.timeline.push({ status: "Delivered", date: order.deliveredDate });
      }

      orders.push(order);
    }
  }

  await Order.insertMany(orders);

  const viewTargets = [4200, 3100, 2800, 1900, 1500, 1200];
  const cartTargets = [380, 290, 210, 165, 120, 95];
  const soldTargets = [180, 140, 120, 85, 70, 55];

  for (let i = 0; i < products.length; i += 1) {
    const p = products[i];
    const views = viewTargets[i] || 800;
    const carts = cartTargets[i] || 80;
    const sold = soldTargets[i] || 40;
    // eslint-disable-next-line no-await-in-loop
    await Product.findByIdAndUpdate(p._id, {
      $set: {
        viewsCount: views,
        cartCount: carts,
        totalSold: sold,
        trendScore: views * 0.3 + sold * 0.5 + carts * 0.2,
      },
    });

    for (let d = 13; d >= 0; d -= 1) {
      const day = utcMidnight(now);
      day.setUTCDate(day.getUTCDate() - d);
      const factor = 0.6 + (14 - d) / 20;
      // eslint-disable-next-line no-await-in-loop
      await ProductDailyStat.findOneAndUpdate(
        { product: p._id, day },
        {
          $set: {
            views: Math.round((views / 30) * factor * (0.8 + (d % 3) * 0.1)),
            cartAdds: Math.round((carts / 30) * factor * (0.7 + (d % 2) * 0.15)),
          },
        },
        { upsert: true },
      );
    }
  }
}

module.exports = { seedAnalyticsDemo };
