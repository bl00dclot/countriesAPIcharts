import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import axios from "axios";
import exp from "constants";


const url = "https://restcountries.com/v3.1/";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan(`dev`))

// Homepage

app.get("/", async (req, res) => {
  try {

      //get API

    const response = await axios.get(`${url}all?fields=name`);

      // Render to front

    res.render('index.ejs', {data: response.data});
  } catch (error) {
    console.error(error.message);
    res.render('index.ejs', {data: error.message})
  }
})







// Create route for specific country

app.get("/country", async (req, res) => {

    // Get user input from anchor link

  const countryName = req.query.name;
  try {

      // Search input

    const response = await axios.get(`${url}name/${countryName}`);

    // Render input country to front

    res.render("index.ejs", {countryData: response.data});
  } catch (error) {
    console.error(error.message);
    res.render('index.ejs', {data: error.message});
  }
})







// Create route for chart options

app.get("/countries", async (req, res) => {
  try {
    res.render("index.ejs", {countriesMain: "Choose a chart"});
  } catch (error) {
    console.error(`Failed to make request:`, error.message);
    res.render(`index.ejs`, {data: error.message})
  };
});

      






// Create route for selected chart option

app.post("/countries/charts", async (req, res) => {
  try {
    // Get user input from the selection
    const chartField = req.body.fields;
    console.log(chartField)
          
        // Define which selection


        // If Regions
          
    if (chartField == "Region") {

      // get API
      const response = await axios.get(url + `all`);
         
      // Store data in an array

      const regionDataArray = [];
          response.data.forEach(element => { 
            regionDataArray.push(element.region);
          });
          
          // Count the repeating values
          
          const regionsCount = regionDataArray.reduce((regions, count) => {
            regions[count] = (regions[count] || 0) + 1;
            return regions
          }, {});
          console.log(regionsCount)
          
          // Render data to front
          
          res.render("index.ejs", {chartsData: regionsCount})
        
        
        
        // if Currencies
        
        
        } else if (chartField == "Currencies") {
          
          // get API

          const response = await axios.get(url + `all`);
          
          // store data in an array
          
          const currenciesDataArray = [];
          response.data.forEach(element => { 
            currenciesDataArray.push(element.currencies);
          });
          
          // remove invalid values
          
          currenciesDataArray.forEach(element => {
            if ( element == null || undefined) {
              let index = currenciesDataArray.indexOf(element);
              currenciesDataArray.splice(index, 1);
            };
          });
          
         // filter out the desired data 
          
         const currencySymbol = [];

          for ( let i = 0; i < currenciesDataArray.length; i++) {
            const [currencyObject] = Object.values(currenciesDataArray[i]);
            currencySymbol.push(currencyObject.symbol);
          }
          
          // Count repeating symbols
          
          const currencySymbolCount = currencySymbol.reduce((symbols, count) => {
            symbols[count] = (symbols[count] || 0) + 1;
            return symbols
          }, {});

          res.render("index.ejs", {chartsData: currencySymbolCount})
        }

        
    
  } catch (error) {
    console.error(`Failed to make request:`, error.message);
    res.render(`index.ejs`, {data: error.message})
  }
})




app.listen(port, () => {
  console.log(port)
})