export const API_BASE_URL = "https://tunglish.onrender.com";
const form = document.getElementsByTagName('form')[0];

const user = {
  email: '',
  password: ''
};

const handleInput = (e) => {
  const { name, value } = e.target;
  user[name] = value;
}

const handleSubmit = async (e) => {
  e.preventDefault();
  if(!user.email.trim()) {
    alert("Email is required!");
    return;
  }

  if(!user.password.trim()) {
    alert("Password is required!");
    return;
  }

  try {
    console.log("jujiman")
    const res = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(user)
    });
    const data = await res.json();

    if(data.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('email', user.email);
      window.location.href = "engToTung.html";
      form.reset();
    }
  } catch (err) {
    alert(err);
    console.error(err);
  }
}
