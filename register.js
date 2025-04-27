document.getElementById("registerForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const submitBtn = e.target.querySelector("button[type='submit']");
    submitBtn.disabled = true;
    submitBtn.textContent = "Processing...";
  
    try {
      const formData = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        phone: `${document.getElementById("country-code").value} ${document.getElementById("phone-number").value}`,
        availability: document.getElementById("availability").value,
        agreed: document.getElementById("terms").checked,
        roles: {
          rescuer: document.getElementById("event-setup").checked,
          caretaker: document.getElementById("activity-coordinator").checked
        }
      };
  
      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
  
      const result = await response.json();
      
      if (!response.ok) throw new Error(result.message || "Registration failed");
      
      alert("✅ Registration successful!"); // Success message
      console.log("Server response:", result); // Debug log
      
    } catch (error) {
      console.error("Submission error:", error);
      alert(`❌ Error: ${error.message}`);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Submit";
    }
  });