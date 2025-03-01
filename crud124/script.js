
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-analytics.js";
import { getDatabase, set, ref, get, remove, update } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyC_oEyTT-VIaanZHrYOwNrI6HmftU_tITA",
  authDomain: "repeatbatch-f0b0f.firebaseapp.com",
  databaseURL: "https://repeatbatch-f0b0f-default-rtdb.firebaseio.com",
  projectId: "repeatbatch-f0b0f",
  storageBucket: "repeatbatch-f0b0f.firebasestorage.app",
  messagingSenderId: "824694453111",
  appId: "1:824694453111:web:7d7d956ff297ed5cb6e772",
  measurementId: "G-MV3PSFNCGQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
console.log("app=>", app);

const db = getDatabase(app);
const add_data = document.getElementById('add_data');
const notification = document.getElementById('notification');

// Function to Add Students
function AddStudents() {
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const rollnumber = document.getElementById('rollnumber').value;

  set(ref(db, 'students/' + rollnumber), {
    name: name,
    email: email,
    rollnumber: rollnumber,
  }).then(() => {
    notification.innerHTML = "ADDED SUCCESSFULLY";
    resetForm();
    ReadData();
  });
}

add_data.addEventListener('click', AddStudents);

// Function to Reset Form Fields
function resetForm() {
  document.getElementById('name').value = "";
  document.getElementById('email').value = "";
  document.getElementById('rollnumber').value = "";
}

// Function to Read Data
function ReadData() {
  const userRef = ref(db, 'students/');
  get(userRef).then((snapshot) => {
    const data = snapshot.val();
    const table = document.querySelector('table');
    let html = '';

    for (const key in data) {
      const { name, email, rollnumber } = data[key];
      html += `
        <tr>
          <td>${name}</td>
          <td>${email}</td>
          <td>${rollnumber}</td>
          <td><button class="del" onclick="deleteData('${rollnumber}')">Delete</button></td>
          <td><button class="up" onclick="updateData('${rollnumber}')">Update</button></td>
        </tr>`;
    }
    table.innerHTML = html;
  });
}

ReadData();

// Function to Delete Data
window.deleteData = function (rollnumber) {
  const userRef = ref(db, `students/${rollnumber}`);
  remove(userRef).then(() => {
    notification.innerHTML = "Data Deleted Successfully";
    ReadData();
  });
};

// Function to Update Data
window.updateData = function (rollnumber) {
  const userRef = ref(db, `students/${rollnumber}`);
  
  get(userRef).then((item) => {
    document.getElementById('name').value = item.val().name;
    document.getElementById('email').value = item.val().email;
    document.getElementById('rollnumber').value = item.val().rollnumber;
  });

  // Show update form
  document.querySelector('.update_Data').classList.add('show');

  const update_btn = document.querySelector('#update_data');
  update_btn.onclick = function () {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const rollnumber = document.getElementById('rollnumber').value;

    // Correct path to update data
    update(ref(db, `students/${rollnumber}`), {
      name: name,
      email: email,
      rollnumber: rollnumber
    }).then(() => {
      notification.innerHTML = "Data Updated Successfully";
      document.querySelector('.update_Data').classList.remove('show');
      resetForm();
      ReadData();
    });
  };
};
