import React, {useEffect, useState} from "react";
import { useHistory } from "react-router";
import bgimg from './img/nationalpark.jpg';
import ReactiveButton from "reactive-button";
import { default as ReactSelect } from "react-select";
import Option from "./Option";

/**
 * Creates a screen to display images from a selected national park/
 * If the park does not contain any images, then an error message is displayed
 * and the user is prompted to display.
 * @returns Functional component of images
 */
const Images = () => {
    
    // Set history for navigation and search
    let history = useHistory();
    let search = "";


    const handleChange = (e) => {
        search = e.target.value;
    } 

    const [parks, setParks] = useState([]);
    const [display, setDisplay] = useState([]);

    useEffect(() => {
        fetch("https://developer.nps.gov/api/v1/parks?limit=500&api_key=YRuS1eUnETXxpwXCIQ3XkUqViRS2EOYVAHRB8rPj", {
            headers : {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }).then(response => response.json().then(data => setParks(data["data"])))
    }, [])

    console.log(parks);

    let transformed = [];
    let namesToCodes = {};
    
    transformed = parks.map(({ fullName, parkCode }) => ({ label: fullName, value: parkCode }));
        transformed.forEach(element => {
            namesToCodes[element["label"]] = element["value"];
    });
    console.log(transformed);


    const [imgs, setImgs] = useState([]);


    const addToSelected = (selection) => {
        let displayData = [];
        console.log(selection);
        let code = selection['value'];
        let request = `https://developer.nps.gov/api/v1/webcams?parkCode=${code}&limit=100&api_key=YRuS1eUnETXxpwXCIQ3XkUqViRS2EOYVAHRB8rPj`;
        fetch(request, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }).then(response => response.json().then(data => setImgs(data)));
        console.log(request);
        console.log(imgs);
    }

    console.log(imgs);


    const displayImgInfo = () => {
        console.log(imgs);
        if (imgs["data"] != undefined) {
            let newSchedule = [];
            if (imgs["data"].length == 0 || (imgs["data"].length == 1 && imgs["data"][0]["status"] == "Inactive")) {
                console.log(imgs["data"]);
                newSchedule.push(
                    <div>
                    <div style={{
                        boxSizing: 'content-box',
                        color: 'white',
                        boxShadow: '10px 10px 8px #888888',
                        backgroundColor: '#f8546c',
                        justifyContent: 'center',
                        alignItems: 'center',
                        textAlign: 'center',
                        padding: '7.3em'
                    }}>
                        <h1>Sorry, no images here for this park. Try selecting a different park.</h1>
                        <br></br>
                        <ReactiveButton buttonState="idle"
                            color="green"
                            idleText="Click to See Why"
                            animation={true}
                            onClick={() => {
                                if (imgs["data"].length == 0) {
                                    window.open("https://www.nps.gov/index.htm");
                                } else {
                                    window.open(imgs["data"][0]["url"]);
                                }
                            }}
                            />
                    </div>
                    </div>
                );
            } else {
                let count = 0;
                imgs["data"].forEach(element => {
                    if (element["images"].length > 0) {
                        let buttonUrl = element["url"];
                        element["images"].push(element["images"][0])
                        element["images"].forEach(url => {
                            newSchedule.push(
                                <div>
                                <img
                                src={url["url"]}
                                alt="new"
                                width="60%"
                                height="60%"
                                />
                                <ReactiveButton buttonState="idle"
                                style={{
                                    marginLeft: "2em",
                                    marginRight: '2em'
                                }}
                                color="green"
                                idleText="More Information"
                                animation={true}
                                onClick={() => window.open(buttonUrl)}
                                />
                                </div>
                            );
                            newSchedule.push(<br></br>);
                        });
                    }
                    newSchedule.pop();
                });
            }
            setDisplay(newSchedule);
        } else {
            console.log("still empty bro bro")
        }
    }

    

    return (
        <div>
            <div style={{
                    backgroundImage: `url(${bgimg})`,
                    backgroundPosition: 'center',
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    width: '100vw',
                    height: '100vh',
                }}>

                <br></br>


                <div style={{
                    width: '95%',
                    marginLeft: '2em',
                }}>
                    {/* <input
                    type="text"
                    placeholder="Enter search query for images..."
                    style={{
                        width: '100%',
                        height: '56px',
                        position: 'relative',
                        borderRadius: '4px',
                        color: '#282828'
                    }}
                    onChange={handleChange}
                    /> */}
                            <ReactSelect
                            options={transformed}
                            closeMenuOnSelect={false}
                            hideSelectedOptions={false}
                            components={{
                                Option
                            }}
                            width="500px"
                            onChange={addToSelected}
                            placeholder="Select parks..."
                            />
                            
                </div>

                <br></br>
                <div>
                    <ReactiveButton buttonState="idle"
                            style={{
                                marginLeft: "3em",
                            }}
                            color="green"
                            idleText="Find Images!"
                            animation={true}
                            onClick={displayImgInfo}
                            />

                    <ReactiveButton buttonState="idle"
                            style={{
                                marginLeft: "6.5em",
                            }}
                            color="red"
                            idleText="Back"
                            animation={true}
                            onClick={() => {history.push("/")}}
                            />
                </div>

                

                <div style={{
                    overflowY: "scroll",
                    height: "400px",
                    marginLeft: "3em",
                    marginTop: "1.3em",
                    marginRight: '3em',
                    backgroundColor: 'white',
                }}>
                    {display}
                </div>
            </div>
        </div>
    )
}

export default Images;