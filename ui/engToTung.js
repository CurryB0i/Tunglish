const API_BASE_URL = "https://tunglish.onrender.com";

const token = localStorage.getItem('token');
const email = localStorage.getItem('email');
console.log(typeof token)
if(!token || !email)
  window.location.href = 'index.html';

const submitBtn = document.getElementById("submit-btn");
const form = document.querySelector('form');
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
    const resData = await res.json();

    if(!resData.ok) {
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

document.querySelectorAll("input").forEach(input => {
  input.addEventListener("input", handleInput);
});
form.addEventListener("submit", handleSubmit);
