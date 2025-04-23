document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
    const errorMsg = document.createElement("p");

    errorMsg.id = "error-message";
    errorMsg.style.color = "red";
    errorMsg.style.marginTop = "10px";
    form.appendChild(errorMsg);

    form.addEventListener("submit", function (e) {
        const password = document.querySelector('input[name="password"]').value;
        const confirmPassword = document.querySelector('input[name="passwordConf"]').value;

        if (password !== confirmPassword) {
            e.preventDefault();
            errorMsg.textContent = "Passwords don´t match!";
        } else {
            errorMsg.textContent = "";
        }
    });
});