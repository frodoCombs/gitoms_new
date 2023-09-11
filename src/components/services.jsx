import React, { useState, useEffect } from 'react';

export const Services = (props) => {
  const [textInput, setTextInput] = useState('enter some text');
  const [responseText, setResponseText] = useState('see the results');
  const [fileContents, setFileContents] = useState('');

  const handleInputChange = (event) => {
    setTextInput(event.target.value);
  };

  const fetchData = async () => {
    try {
      const response = await fetch('http://44.205.71.6:3000/', {mode:'cors'});
      const data = await response.text();
      setFileContents(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  
  const handleSubmit = async (event) => {
    event.preventDefault();    
    const URL = "https://us-central1-aiplatform.googleapis.com/v1/projects/987065828632/locations/us-central1/endpoints/3372283526249447424:predict"
    const predjson = {"instances": [{
      "mimeType": "text/plain",
      "content": textInput
    }]};
    try {
      const response = await fetch(URL, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + fileContents,
          'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify(predjson),
      });

      if (response.ok) {
        const responseData = await response.json()
        console.log(responseData)
        const a = responseData.predictions[0].confidences[0];
        const b = responseData.predictions[0].confidences[1];
        let responseOutput = '';
        let responseMessage = '';
        if (a > b) {
          if (a > 0.95){
            responseMessage = "This is very biased to the ";
            responseOutput = responseData.predictions[0].displayNames[0];
          } else if ( a > 0.85){
            responseMessage = "This is biased to the ";
            responseOutput = responseData.predictions[0].displayNames[0];
          } else {
            responseMessage = "This is not very biased ";
            responseOutput = " ";
          }
          
        } else {
          if (b > 0.95){
            responseMessage = "This is very biased to the ";
            responseOutput = responseData.predictions[0].displayNames[1];
          } else if ( b > 0.85){
            responseMessage = "This is biased to the ";
            responseOutput = responseData.predictions[0].displayNames[1];
          }
          else {
            responseMessage = "This is not very biased ";
            responseOutput = " ";
          }
        }
        setResponseText(responseMessage+responseOutput);
      } else {
        console.error('Error sending POST request');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    // Fetch initial data on component mount
    fetchData();
  }, []);
  return (
    <div id="services" className="text-center">
      <div className="container">
        <div className="section-title">
          <h2>try it out</h2>
          <p> paste some text from a publication of your choosing and see if it is biased.
          </p>
        </div>
          <div className='container'>
            <form onSubmit={handleSubmit}>
            <div className='textbox-container'>
                  <textarea value={textInput} rows={3} onChange={handleInputChange}></textarea>
                  <textarea value={responseText} rows={3} readOnly></textarea>
              </div>
              
              <button className="btn btn-custom btn-lg page-scroll" type="submit">Submit</button>
            </form>
          </div>
        {/* <div className="row">
          {props.data
            ? props.data.map((d, i) => (
                <div key={`${d.name}-${i}`} className="col-md-4">
                  {" "}
                  <i className={d.icon}></i>
                  <div className="service-desc">
                    <h3>{d.name}</h3>
                    <p>{d.text}</p>
                  </div>
                </div>
              ))
            : "loading"}
        </div> */}
      </div>
    </div>
  );
};
