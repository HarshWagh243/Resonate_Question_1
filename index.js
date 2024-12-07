document.addEventListener("DOMContentLoaded", function () {
    // Attach event listener to the button
    document.querySelector("button").addEventListener("click", RunTests);
});


// Function to generate a short code from storeId and transactionId
function generateShortCode(storeId, transactionId) {
    // Helper function to convert a number to base36 with padding to a specific length
    function toBase36(num, length) {
        return num.toString(36).toUpperCase().padStart(length, '0'); // Convert number to base36, ensuring a fixed length
    }

    // Encode the store ID as a 2-character base36 string
    const storeCode = toBase36(storeId, 2);

    // Encode the transaction ID as a 3-character base36 string
    const transactionCode = toBase36(transactionId, 3);

    // Encode today's date as a day of the year (1-365) and convert to a 2-character base36 string
    const today = new Date(); // Get today's date
    const startOfYear = new Date(today.getFullYear(), 0, 0); // Start of the current year (January 1st)
    const diff = today - startOfYear; // Get the difference in milliseconds
    const oneDay = 1000 * 60 * 60 * 24; // Milliseconds in a day
    const dayOfYear = Math.floor(diff / oneDay); // Calculate the day of the year
    const dateCode = toBase36(dayOfYear, 2); // Convert the day of the year to base36

    // Combine the store, transaction, and date codes into the final short code
    const shortCode = `${storeCode}${transactionCode}${dateCode}`;
    return shortCode; // The resulting code will have a maximum length of 7 characters
}

// Function to decode the short code back to storeId, transactionId, and the transaction date
function decodeShortCode(shortCode) {
    // Helper function to convert base36 string back to a number
    function fromBase36(str) {
        return parseInt(str, 36); // Parse base36 string back into a number
    }

    // Extract components from the short code
    const storeCode = shortCode.slice(0, 2); // First 2 characters represent the store ID
    const transactionCode = shortCode.slice(2, 5); // Next 3 characters represent the transaction ID
    const dateCode = shortCode.slice(5, 7); // Last 2 characters represent the day of the year

    // Decode components into their respective values
    const storeId = fromBase36(storeCode); // Decode the store ID from base36
    const transactionId = fromBase36(transactionCode); // Decode the transaction ID from base36
    const dayOfYear = fromBase36(dateCode); // Decode the day of the year from base36

    // Calculate the exact date from the day of the year
    const shopDate = new Date(new Date().getFullYear(), 0, dayOfYear); // Create a date object from the decoded day of the year

    return {
        storeId, // Return the decoded store ID
        shopDate, // Return the decoded transaction date
        transactionId, // Return the decoded transaction ID
    };
}

// ----------------------------------------------------------------------------//
// --------------- The following section runs tests to verify functionality --------------- //
// ----------------------------------------------------------------------------//
function RunTests() {
    console.log("RunTests executed"); // Debug log
    var storeIds = [175, 42, 0, 9] // Sample store IDs for testing
    var transactionIds = [9675, 23, 123, 7] // Sample transaction IDs for testing

    // Iterate through each store ID and transaction ID combination
    storeIds.forEach(function (storeId) {
        transactionIds.forEach(function (transactionId) {
            var shortCode = generateShortCode(storeId, transactionId); // Generate the short code
            var decodeResult = decodeShortCode(shortCode); // Decode the short code to get the original values

            // Display the generated short code and test results on the page
            $("#test-results").append("<div>" + storeId + " - " + transactionId + ": " + shortCode + "</div>");
            
            // Run the following tests to validate the short code logic
            AddTestResult("Length <= 9", shortCode.length <= 9); // Test if the length is less than or equal to 9
            AddTestResult("Is String", (typeof shortCode === 'string')); // Test if the result is a string
            AddTestResult("Is Today", IsToday(decodeResult.shopDate)); // Test if the decoded date matches today's date
            AddTestResult("StoreId", storeId === decodeResult.storeId); // Test if the decoded store ID matches the input
            AddTestResult("TransId", transactionId === decodeResult.transactionId); // Test if the decoded transaction ID matches the input
        })
    })
}

// Function to check if the decoded date is today's date
function IsToday(inputDate) {
    var todaysDate = new Date(); // Get today's date
    // Reset the time of the input and today's date to avoid time-related discrepancies
    return (inputDate.setHours(0, 0, 0, 0) == todaysDate.setHours(0, 0, 0, 0));
}

// Function to add the test results to the page with appropriate styling
function AddTestResult(testName, testResult) {
    var div = $("#test-results").append("<div class='" + (testResult ? "pass" : "fail") + "'><span class='tname'>- " + testName + "</span><span class='tresult'>" + testResult + "</span></div>");
}
