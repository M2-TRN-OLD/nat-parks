'use strict';

const searchUrl='https://api.nps.gov/api/v1/parks';

//display the proper results in the DOM
function displayResults(responseJson) {
    console.log('displayResults fired');
    $('#js-results-list').empty();
    let htmlString ='';
    for (let i = 0; i < responseJson.data.length-1; i++ ) {
        htmlString += `<li><p>State:  ${responseJson.data[i].states}</p>
            <h3>${responseJson.data[i].fullName}</h3>
            <p>${responseJson.data[i].description}</p>
            <p>${responseJson.data[i].url}</p>`
    };
    $('#js-results-list').append(htmlString);
    $('#js-results').removeClass('hidden');


}

//format the query parameters to concatenate with the url
function formatQueryParams(queryFields) {
    console.log('formatQueryParams fired');
    const queryItems = Object.keys(queryFields)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(queryFields[key])}`);
    return queryItems.join('&');
}


//develop url string, get the data and display it in the DOM
function getNatParks(term,resultNum) {
    console.log('fired getNatParks');
    //create the proper URL string to pass into the fetch
    const params = {
        limit: resultNum,
        stateCode: term,
    }
    const paramStr = formatQueryParams(params);
    const url = searchUrl + '?' + paramStr + '&sort=states';

    //fetch the data from the API
    fetch(url)
      .then(response => {
          if (response.ok) {
              return response.json();
          }
          throw new Error(response.statusText);
        })
      .then(responseJson => {
          displayResults(responseJson)})
      .catch(err => {
          $('#js-error-message').text(`Something went terribly wrong:  ${err.message}`);
      });

      
}

// listen for user input on the form
function watchForm() {
    $('#js-form').on('submit', function(event) {
        console.log('event listener is working');
        event.preventDefault();
        const searchTerm = $('#js-search-term').val();
        const maxResults = $('#js-max-results').val();
        console.log(maxResults);
        getNatParks(searchTerm, maxResults);
    });
}

$(watchForm);