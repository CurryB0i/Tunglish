import { API_BASE_URL } from "./auth";

const token = localStorage.getItem('token');
const email = localStorage.getItem('email');
console.log(typeof token)
if(!token || !email)
  window.location.href = 'index.html';

const submitBtn = document.getElementById("submit-btn");
const form = document.getElementsByTagName('form')[0];
const data = {
  email,
  token,
  english: "",
  tunglish: ""
};

const handleInput = (e) => {
  const { name, value } = e.target;
  data[name] = value;
}

const handleSubmit = async (e) => {
  e.preventDefault();
  if(!data.english.trim()) {
    alert("English field required!");
    return;
  }

  if(!data.tunglish.trim()) {
    alert("Tunglish field required!");
    return;
  }

  try {
    submitBtn.classList.add('submitting');
    const res = await fetch(`${API_BASE_URL}/engToTung`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
    const data = await res.json();

    if(!data.ok) {
      alert("Something went wrong!");
      submitBtn.classList.remove('submitting');
      form.reset();
      return;
    }
    submitBtn.classList.remove('submitting');
    submitBtn.classList.add('submitted');
    setTimeout(() => submitBtn.classList.remove('submitted'), 500);
    form.reset();
  } catch (err) {
    alert(err);
    console.error(err);
  }
}
