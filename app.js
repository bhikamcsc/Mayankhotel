import { db, collection, addDoc, serverTimestamp } from "./firebase-config.js";

const ownerWhatsApp = "919950221161";

const menuPrices = {
  "Paneer Butter Masala": 180,
  "Veg Thali": 120,
  "Pizza": 150,
  "Burger": 70,
  "Cold Drink": 40
};

function calculateAmount(){
  const item = document.getElementById("oItem").value;
  const qty = Number(document.getElementById("oQty").value || 1);
  const amount = (menuPrices[item] || 0) * qty;
  document.getElementById("oAmount").value = amount ? `₹${amount}` : "";
  return amount;
}

document.getElementById("oItem").addEventListener("change", calculateAmount);
document.getElementById("oQty").addEventListener("input", calculateAmount);

document.getElementById("bookingForm").addEventListener("submit", async function(e){
  e.preventDefault();

  const booking = {
    name: document.getElementById("bName").value,
    phone: document.getElementById("bPhone").value,
    date: document.getElementById("bDate").value,
    time: document.getElementById("bTime").value,
    guests: Number(document.getElementById("bGuests").value),
    advanceAmount: Number(document.getElementById("bAdvance").value),
    message: document.getElementById("bMessage").value,
    status: "New",
    paymentStatus: Number(document.getElementById("bAdvance").value) > 0 ? "Advance Pending" : "No Advance",
    createdAt: serverTimestamp()
  };

  try{
    await addDoc(collection(db, "bookings"), booking);

    const msg = `👑 Mayank Restorent Table Booking
Name: ${booking.name}
Phone: ${booking.phone}
Date: ${booking.date}
Time: ${booking.time}
Guests: ${booking.guests}
Advance: ₹${booking.advanceAmount}
Message: ${booking.message || "No"}`;

    window.open("https://wa.me/" + ownerWhatsApp + "?text=" + encodeURIComponent(msg), "_blank");
    alert("Booking database me save ho gayi.");
    this.reset();
  }catch(error){
    alert("Firebase error: " + error.message);
  }
});

document.getElementById("orderForm").addEventListener("submit", async function(e){
  e.preventDefault();

  const item = document.getElementById("oItem").value;
  const qty = Number(document.getElementById("oQty").value);
  const amount = calculateAmount();

  const order = {
    name: document.getElementById("oName").value,
    phone: document.getElementById("oPhone").value,
    item,
    qty,
    amount,
    address: document.getElementById("oAddress").value,
    paymentStatus: document.getElementById("oPaymentStatus").value,
    orderStatus: "New",
    createdAt: serverTimestamp()
  };

  try{
    await addDoc(collection(db, "orders"), order);

    const msg = `🛵 Mayank Restorent Online Order
Name: ${order.name}
Phone: ${order.phone}
Item: ${order.item}
Qty: ${order.qty}
Amount: ₹${order.amount}
Payment: ${order.paymentStatus}
Address: ${order.address}`;

    window.open("https://wa.me/" + ownerWhatsApp + "?text=" + encodeURIComponent(msg), "_blank");
    alert("Order database me save ho gaya.");
    this.reset();
    document.getElementById("oAmount").value = "";
  }catch(error){
    alert("Firebase error: " + error.message);
  }
});
