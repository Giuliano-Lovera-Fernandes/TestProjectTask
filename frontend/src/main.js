import './style.css'

// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  console.log('DOM fully loaded.');
  const messagePrompt = document.getElementById("messagePrompt");

  // Event listener for the fetch button click
  document.getElementById("fetchData").addEventListener("click", async function () {
    console.log("Button clicked. Starting request....");

    // Show loading indicator
    showLoadingIndicator(true);

    // Get the entered keyword and trim whitespace
    const keyword = document.getElementById("keywordInput").value.trim();

    console.log('Entered keyword:', keyword);

    if (!keyword) {
      showSnackbar('Please enter a keyword!', 'error'); // Show a non-intrusive message
      showLoadingIndicator(false);
      return;
    }

    // Construct the request URL with the entered keyword
    const url = `http://localhost:3000/api/scrape?keyword=${encodeURIComponent(keyword)}`;

    console.log('Generated request URL:', url);

    try {
      console.log('Sending request to API...');
      const response = await fetch(url, { method: "GET" });
      console.log('Response received:', response.status, response.statusText);

      // Check if the response is valid
      if (!response.ok) {
        showSnackbar(`Error HTTP: ${response.status}, 'error'`);
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      // Parse the response JSON
      const data = await response.json(); // Pega os dados da resposta uma vez
      console.log('Raw data received from API:', data);

      // Check if the API is healthy and contains products
      if (data.status === "healthy" && data.products.length > 0) {
        console.log(`Número de produtos recebidos: ${data.products.length}`);

        //just only product for test
        //const product = data.products[0];

        //console.log("First product extracted:", product);

        // Loop to create table rows for the first 10 products for test
        //data.products.slice(0, 10).forEach(product => {  

        data.products.forEach(product => {
          // Create the star rating (e.g., 4.7 -> -> ★★★★☆)
          const rating = product.rating;
          const fullStars = Math.floor(rating);
          const halfStar = rating % 1 >= 0.5 ? "⭐" : "";
          const stars = "⭐".repeat(fullStars) + halfStar + "☆".repeat(5 - fullStars - halfStar.length);

          // Create a new table row for the product
          const newRow = document.createElement("tr");
          newRow.innerHTML = `
          <td>
            <div class="product">
              <img src="${product.image}" alt="${product.title}" height="100" width="100">
              <div class="info">
                <div class="name">${product.title}</div>
                <div class="rating">${stars} (${product.rating})</div>
                <div class="reviews">${product.number_of_reviews} avaliações</div>
                <div class="category">Cartões de Memória</div>
              </div>
            </div>
          </td>
          <td>R$ XXXX</td> <!-- Ajuste o preço conforme necessário -->
          <td>
            <div class="quantity">
              <button><i class="bx bx-minus"></i></button>
              <span>1</span>
              <button><i class="bx bx-plus"></i></button>
            </div>
          </td>
          <td>R$ XXXX</td> <!-- Ajuste conforme necessário -->
          <td>
            <div class="remove">
              <button><i class="bx bx-x"></i></button>
            </div>
          </td>
          `;

          // Append the new row to the table body
          document.querySelector("tbody").appendChild(newRow);
        });

        applyCounterLogic();

        // Hide the "No results" message if products are found
        document.getElementById("noResultsMessage").style.display = "none";
        document.getElementById("resultsTable").style.display = "table";
      }
      else {
        document.getElementById("noResultsMessage").style.display = "block";
      }

      console.log('Received data: ', data);
      showSnackbar("Data received successfully!", 'success');
    } catch (error) {
      console.error('Erro na requisição:', error);
      showSnackbar('Error fetching data!', 'error');
    } finally {
      // Hide loading indicator after request completion
      showLoadingIndicator(false);
      messagePrompt.style.display = "none";
    }
  });
});

/* 
  Function to show snackbar
  Inspired by Material Design Snackbars: 
  https://m3.material.io/components/snackbar/overview
*/
function showSnackbar(message, type = 'success') {
  const snackbar = document.createElement('div');
  snackbar.innerText = message;
  snackbar.className = `snackbar show ${type}`;
  document.body.appendChild(snackbar);

  setTimeout(() => {
    snackbar.classList.remove('show');
    setTimeout(() => snackbar.remove(), 300); // Remove from DOM after animation
  }, 3000);
}

// Function to apply the counter logic to all quantity divs
function applyCounterLogic() {
  document.querySelectorAll('.quantity').forEach(quantityDiv => {
    const minusBtn = quantityDiv.querySelector('.bx-minus');
    const plusBtn = quantityDiv.querySelector('.bx-plus');
    const countSpan = quantityDiv.querySelector('span');

    let counter = parseInt(countSpan.innerText, 10); // Convert the text to a number

    // Function to update the counter
    function updateCounter(newValue) {
      if (newValue >= 0) {  // Prevent negative values
        counter = newValue;
        countSpan.innerText = counter;
      }
    }

    // Button events
    minusBtn.addEventListener('click', () => updateCounter(counter - 1));
    plusBtn.addEventListener('click', () => updateCounter(counter + 1));
  });
}

// Function to show/hide loading indicator
function showLoadingIndicator(show) {
  const loadingElement = document.getElementById("loadingIndicator");

  if (show) {
    loadingElement.style.display = "block"; // Show loading indicator
  } else {
    loadingElement.style.display = "none"; // Hide loading indicator
  }
}
