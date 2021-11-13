import React, {useEffect, useState} from "react";
import bgimg from './img/nationalpark.jpg';
import { default as ReactSelect } from "react-select";
import Option from "./Option";
import { BootstrapTable, TableHeaderColumn, BootstrapButton } from "react-bootstrap-table";
import ReactiveButton from 'reactive-button';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap-table/dist/react-bootstrap-table.min.css';
import { useHistory } from "react-router";

/**
 * Returns the screen that contains a selection bar for the different activities that
 * individuals can partake in at the various national parks. Submitting the activity
 * request results in the user seeing a table with all the information.
 * @returns 
 */
const Home = () => {

    let history = useHistory(); // Setting router history to change pages on back

    // Use of state to maintain different information needed.
    const [activities, setActivities] = useState([])
    const [parks, setParks] = useState([]);
    const [table, setTable] = useState([]);

    // Fetch from API all the activities that are available for the user.
    useEffect(() => {
        fetch("https://developer.nps.gov/api/v1/activities?api_key=YRuS1eUnETXxpwXCIQ3XkUqViRS2EOYVAHRB8rPj", {
            headers : {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }).then(response => response.json().then(data => setActivities(data)))
    }, []);


    // Adjust the activity data to contain values and labels such that 
    let transformed = [];
    let namesToIds = {};
    if (activities["data"] != undefined && activities["data"].length > 0) {
        transformed = activities["data"].map(({ id, name }) => ({ label: name, value: id }));
        transformed.forEach(element => {
            namesToIds[element["label"]] = element["value"];
        });
    }

    /**
     * Adds on the newly selected activity to the selection list of all the activities
     * selected so far. Essentially, a string is produced that contains each name id
     * that allows querying to find all the possible parks.
     * @param {JSON Object} selection 
     */
    const addToSelected = (selection) => {
        let resultString = "";
        // Adjust result string with all park name ids.
        selection.forEach(element => {
            console.log(element);
            resultString += namesToIds[element["label"]] + ",";
        });
        resultString = resultString.substr(0, resultString.length - 1);
        let request = `https://developer.nps.gov/api/v1/activities/parks?id=${resultString}&api_key=YRuS1eUnETXxpwXCIQ3XkUqViRS2EOYVAHRB8rPj`
        console.log(resultString);
        if (resultString.length > 0) {
            fetch(request, {
                        headers : {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        }
                    }).then(response => response.json().then(data => setParks(gatherInfo(data))));
        } else {
            setParks([]);
        }
    }

    /**
     * Gets all information for each specific park that the addToSelected function produces
     * in the state of the current parks. THe information includes the activity that the
     * park is associated with as well as the additional link to learn more.
     * @param {List} parks 
     * @returns Array containing all park information
     */
    const gatherInfo = (parks) => {
        let allParks = [];
        let totalParks = parks["data"];
        totalParks.forEach(element => {
            let activity = element["name"];
            element["parks"].forEach(element => {
                element["activity"] = activity;
                element[element["url"]] = <button>Press Me</button>
                allParks.push(element);
            });
        });
        return allParks;
    }

    /**
     * Handles the submission of the button that opens a new page of the supplied URL.
     * @param {String} url Link to open new page 
     */
    const handleSubmit = (url) => {
        window.open(`${url}`);
    }

    /**
     * 
     * @param {String} cell Main url that is passed
     * @param {String} row Additional unused data
     * @param {String} url Additional unused data
     * @returns Button that, on click, opens new page.
     */
    const buttonFormat = (cell, row, url) => {
        return <ReactiveButton 
                            buttonState="idle"
                            color="green"
                            idleText="Learn More!"
                            animation={true}
                            onClick={() => handleSubmit(cell)}
                            />
    }

    /**
     * Adjusts the current schedule with a table that contains all the parks and the
     * associated park code, states, and button that links to the park specific page on
     * the National Park Service domain.
     */
    const getSchedule = () => {
        console.log(parks);
        if (parks.length > 0) {
            // Only adjust current schedule if there are parks available.
            let newSchedule = [];
            newSchedule.push(<BootstrapTable data={parks} striped hover borderRadius="1em" tableStyle={{
                backgroundColor: "white"
            }} bodyStyle={{
                wordBreak: "break-all"
            }}>
            <TableHeaderColumn isKey dataField='states'>State</TableHeaderColumn>
            <TableHeaderColumn dataField="activity" width="12em">Activity</TableHeaderColumn>
            <TableHeaderColumn dataField='fullName'>Park Name</TableHeaderColumn>
            <TableHeaderColumn dataField='parkCode' overflowY="scroll" width="4.5em">Code</TableHeaderColumn>
            <TableHeaderColumn dataField='url' dataFormat={buttonFormat} width="7em">Learn More</TableHeaderColumn>
            </BootstrapTable>);
            setTable(newSchedule);
        } else {
            setTable([]);
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
                        width: "85vw",
                        display: 'inline-flex',
                        boxSizing: "content-box",
                        justifyContent: "center",
                        alignItems: 'baseline',
                        marginLeft: '5em',
                        padding: '1em',
                        marginBottom: '2em',
                        backgroundColor: 'green',
                        color: '#fff',
                        borderRadius: '10em',
                        boxShadow: '10px 10px 8px #888888'
                    }}>
                        <h1>
                        Welcome to National Parks!
                        </h1>
                    </div>
                    <div style={{
                        marginLeft: "3em",
                        
                    }}>
                        
                        <span
                            class="d-inline-block"
                            data-toggle="popover"
                            data-trigger="focus"
                            data-content="Please select activitie(s)"
                        >
                            <ReactSelect
                            options={transformed}
                            isMulti
                            closeMenuOnSelect={false}
                            hideSelectedOptions={false}
                            components={{
                                Option
                            }}
                            onChange={addToSelected}
                            placeholder="Select activities..."
                            />
                            
                        </span>
                    </div>
                    <br></br>
                    <div style={{
                        flex: '1',
                        flexDirection: 'row',
                        justifyContent: 'space-between'
                    }}>
                        <ReactiveButton 
                            buttonState="idle"
                            style={{
                                marginLeft: "3.5em"
                            }}
                            color="green"
                            idleText="Show Parks!"
                            animation={true}
                            onClick={getSchedule}
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
                                height: "320px",
                                marginLeft: "3em",
                                marginTop: "1.3em",
                                marginRight: '3em'
                                }}>{table}
                                </div>
            </div>
        </div>
    );
}

export default Home;