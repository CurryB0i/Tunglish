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
    const res = await fetch("http://127.0.0.1:8000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(user)
    });
    const data = await res.json();

    if(data.ok) {
      console.log(data)
      localStorage.setItem('token', data.token);
      localStorage.setItem('email', user.email);
      window.location.href = "engToTung.html";
      form.dataet();
    }
  } catch (err) {
    console.error(err);
  }
}