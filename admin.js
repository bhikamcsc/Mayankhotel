import {
  db, collection, getDocs, updateDoc, deleteDoc, doc, query, orderBy
} from "./firebase-config.js";

const ADMIN_PASSWORD = "12345";

window.loginAdmin = function(){
  const pass = document.getElementById("adminPass").value;
  if(pass === ADMIN_PASSWORD){
    localStorage.setItem("mayankAdminLogin", "yes");
    showPanel();
  }else{
    alert("Wrong password");
  }
};

window.logoutAdmin = function(){
  localStorage.removeItem("mayankAdminLogin");
  location.reload();
};

function showPanel(){
  document.getElementById("loginBox").style.display = "none";
  document.getElementById("adminPanel").style.display = "block";
  loadDashboard();
}

if(localStorage.getItem("mayankAdminLogin") === "yes"){
  showPanel();
}

async function loadDashboard(){
  const bookingSnap = await getDocs(query(collection(db, "bookings"), orderBy("createdAt", "desc")));
  const orderSnap = await getDocs(query(collection(db, "orders"), orderBy("createdAt", "desc")));

  const bookings = [];
  const orders = [];

  bookingSnap.forEach(d => bookings.push({ id: d.id, ...d.data() }));
  orderSnap.forEach(d => orders.push({ id: d.id, ...d.data() }));

  document.getElementById("totalBookings").innerText = bookings.length;
  document.getElementById("totalOrders").innerText = orders.length;

  const totalAmount = orders.reduce((sum, o) => sum + Number(o.amount || 0), 0)
    + bookings.reduce((sum, b) => sum + Number(b.advanceAmount || 0), 0);

  document.getElementById("totalAmount").innerText = "₹" + totalAmount;

  const pendingCount = orders.filter(o => o.paymentStatus !== "Paid").length
    + bookings.filter(b => b.paymentStatus === "Advance Pending").length;

  document.getElementById("pendingPayments").innerText = pendingCount;

  renderBookings(bookings);
  renderOrders(orders);
}

function renderBookings(bookings){
  const table = document.getElementById("bookingTable");
  table.innerHTML = `
    <tr>
      <th>Name</th><th>Phone</th><th>Date</th><th>Time</th><th>Guests</th>
      <th>Advance</th><th>Payment</th><th>Status</th><th>Action</th>
    </tr>
  `;

  bookings.forEach(b => {
    table.innerHTML += `
      <tr>
        <td>${b.name || ""}</td>
        <td>${b.phone || ""}</td>
        <td>${b.date || ""}</td>
        <td>${b.time || ""}</td>
        <td>${b.guests || ""}</td>
        <td>₹${b.advanceAmount || 0}</td>
        <td>${b.paymentStatus || ""}</td>
        <td>${b.status || ""}</td>
        <td>
          <button class="small-btn ok" onclick="updateBooking('${b.id}','Confirmed','Paid')">Confirm</button>
          <button class="small-btn pending" onclick="updateBooking('${b.id}','Pending','Advance Pending')">Pending</button>
          <button class="small-btn danger" onclick="deleteBooking('${b.id}')">Delete</button>
        </td>
      </tr>
    `;
  });
}

function renderOrders(orders){
  const table = document.getElementById("orderTable");
  table.innerHTML = `
    <tr>
      <th>Name</th><th>Phone</th><th>Item</th><th>Qty</th><th>Amount</th>
      <th>Payment</th><th>Order Status</th><th>Address</th><th>Action</th>
    </tr>
  `;

  orders.forEach(o => {
    table.innerHTML += `
      <tr>
        <td>${o.name || ""}</td>
        <td>${o.phone || ""}</td>
        <td>${o.item || ""}</td>
        <td>${o.qty || ""}</td>
        <td>₹${o.amount || 0}</td>
        <td>${o.paymentStatus || ""}</td>
        <td>${o.orderStatus || ""}</td>
        <td>${o.address || ""}</td>
        <td>
          <button class="small-btn ok" onclick="updateOrder('${o.id}','Completed','Paid')">Complete</button>
          <button class="small-btn pending" onclick="updateOrder('${o.id}','Preparing','Pending')">Preparing</button>
          <button class="small-btn danger" onclick="deleteOrder('${o.id}')">Delete</button>
        </td>
      </tr>
    `;
  });
}

window.updateBooking = async function(id, status, paymentStatus){
  await updateDoc(doc(db, "bookings", id), { status, paymentStatus });
  loadDashboard();
};

window.updateOrder = async function(id, orderStatus, paymentStatus){
  await updateDoc(doc(db, "orders", id), { orderStatus, paymentStatus });
  loadDashboard();
};

window.deleteBooking = async function(id){
  if(confirm("Booking delete karni hai?")){
    await deleteDoc(doc(db, "bookings", id));
    loadDashboard();
  }
};

window.deleteOrder = async function(id){
  if(confirm("Order delete karna hai?")){
    await deleteDoc(doc(db, "orders", id));
    loadDashboard();
  }
};
