import {
  db,
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy
} from "./firebase-config.js";

/* =========================
ADMIN PASSWORD
========================= */

const ADMIN_PASSWORD = "mayank@2026";

/* =========================
LOGIN FUNCTION
========================= */
document.getElementById("loginBtn").addEventListener("click", loginAdmin);
window.loginAdmin = function(){

  const pass =
  document.getElementById("adminPass").value;

  if(pass === ADMIN_PASSWORD){

    sessionStorage.setItem(
      "mayankAdminLogin",
      "yes"
    );

    showPanel();

  }else{

    alert("Wrong Password");

  }

};
document.getElementById("loginBtn").addEventListener("click", window.loginAdmin);

/* =========================
LOGOUT FUNCTION
========================= */

window.logoutAdmin = function(){

  sessionStorage.removeItem(
    "mayankAdminLogin"
  );

  location.reload();

};

/* =========================
SHOW PANEL
========================= */

function showPanel(){

  document.getElementById(
    "loginBox"
  ).style.display = "none";

  document.getElementById(
    "adminPanel"
  ).style.display = "block";

  loadDashboard();

}

/* =========================
CHECK LOGIN
========================= */

if(
  sessionStorage.getItem(
    "mayankAdminLogin"
  ) === "yes"
){
  showPanel();
}

/* =========================
LOAD DASHBOARD
========================= */

async function loadDashboard(){

  const bookingSnap =
  await getDocs(
    query(
      collection(db,"bookings"),
      orderBy("createdAt","desc")
    )
  );

  const orderSnap =
  await getDocs(
    query(
      collection(db,"orders"),
      orderBy("createdAt","desc")
    )
  );

  const bookings = [];
  const orders = [];

  bookingSnap.forEach(docu=>{
    bookings.push({
      id:docu.id,
      ...docu.data()
    });
  });

  orderSnap.forEach(docu=>{
    orders.push({
      id:docu.id,
      ...docu.data()
    });
  });

  /* TOTALS */

  document.getElementById(
    "totalBookings"
  ).innerText = bookings.length;

  document.getElementById(
    "totalOrders"
  ).innerText = orders.length;

  let totalAmount = 0;

  orders.forEach(o=>{
    totalAmount += Number(o.amount || 0);
  });

  bookings.forEach(b=>{
    totalAmount += Number(
      b.advanceAmount || 0
    );
  });

  document.getElementById(
    "totalAmount"
  ).innerText = "₹" + totalAmount;

  /* PENDING */

  const pending =
  orders.filter(
    o=>o.paymentStatus !== "Paid"
  ).length;

  document.getElementById(
    "pendingPayments"
  ).innerText = pending;

  renderBookings(bookings);
  renderOrders(orders);

}

/* =========================
BOOKINGS TABLE
========================= */

function renderBookings(bookings){

  const table =
  document.getElementById(
    "bookingTable"
  );

  table.innerHTML = `
  <tr>
    <th>Name</th>
    <th>Phone</th>
    <th>Date</th>
    <th>Guests</th>
    <th>Advance</th>
    <th>Status</th>
    <th>Action</th>
  </tr>
  `;

  bookings.forEach(b=>{

    table.innerHTML += `
    <tr>
      <td>${b.name || ""}</td>
      <td>${b.phone || ""}</td>
      <td>${b.date || ""}</td>
      <td>${b.guests || ""}</td>
      <td>₹${b.advanceAmount || 0}</td>
      <td>${b.status || "New"}</td>

      <td>

        <button
        class="small-btn ok"
        onclick="confirmBooking('${b.id}')">
        Confirm
        </button>

        <button
        class="small-btn danger"
        onclick="deleteBooking('${b.id}')">
        Delete
        </button>

      </td>

    </tr>
    `;

  });

}

/* =========================
ORDERS TABLE
========================= */

function renderOrders(orders){

  const table =
  document.getElementById(
    "orderTable"
  );

  table.innerHTML = `
  <tr>
    <th>Name</th>
    <th>Item</th>
    <th>Qty</th>
    <th>Amount</th>
    <th>Payment</th>
    <th>Action</th>
  </tr>
  `;

  orders.forEach(o=>{

    table.innerHTML += `
    <tr>

      <td>${o.name || ""}</td>

      <td>${o.item || ""}</td>

      <td>${o.qty || ""}</td>

      <td>₹${o.amount || 0}</td>

      <td>${o.paymentStatus || ""}</td>

      <td>

        <button
        class="small-btn ok"
        onclick="completeOrder('${o.id}')">
        Complete
        </button>

        <button
        class="small-btn danger"
        onclick="deleteOrder('${o.id}')">
        Delete
        </button>

      </td>

    </tr>
    `;

  });

}

/* =========================
UPDATE BOOKING
========================= */

window.confirmBooking =
async function(id){

  await updateDoc(
    doc(db,"bookings",id),
    {
      status:"Confirmed"
    }
  );

  loadDashboard();

};

/* =========================
COMPLETE ORDER
========================= */

window.completeOrder =
async function(id){

  await updateDoc(
    doc(db,"orders",id),
    {
      paymentStatus:"Paid"
    }
  );

  loadDashboard();

};

/* =========================
DELETE BOOKING
========================= */

window.deleteBooking =
async function(id){

  if(confirm("Delete Booking?")){

    await deleteDoc(
      doc(db,"bookings",id)
    );

    loadDashboard();

  }

};

/* =========================
DELETE ORDER
========================= */

window.deleteOrder =
async function(id){

  if(confirm("Delete Order?")){

    await deleteDoc(
      doc(db,"orders",id)
    );

    loadDashboard();

  }

};
