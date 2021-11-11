import React, {useEffect, useState} from "react";
import bgimg from './img/nationalpark.jpg';
import { default as ReactSelect } from "react-select";
import Option from "./Option";
import { BootstrapTable, TableHeaderColumn, BootstrapButton } from "react-bootstrap-table";
import ReactiveButton from 'reactive-button';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap-table/dist/react-bootstrap-table.min.css';
import { useHistory } from "react-router";


const Home = () => {

    let history = useHistory();

    const [activities, setActivities] = useState([])
    const [parks, setParks] = useState([]);
    const [table, setTable] = useState([]);

    useEffect(() => {
        fetch("https://developer.nps.gov/api/v1/activities?api_key=YRuS1eUnETXxpwXCIQ3XkUqViRS2EOYVAHRB8rPj", {
            headers : {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }).then(response => response.json().then(data => setActivities(data)))
    }, []);


    let transformed = [];
    let namesToIds = {};
    if (activities["data"] != undefined && activities["data"].length > 0) {
        transformed = activities["data"].map(({ id, name }) => ({ label: name, value: id }));
        transformed.forEach(element => {
            namesToIds[element["label"]] = element["value"];
        });
    }

    const addToSelected = (selection) => {
        let resultString = "";
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


    const handleSubmit = (url) => {
        window.open(`${url}`);
      }

    const buttonFormat = (cell, row, url) => {
        return <ReactiveButton 
                            buttonState="idle"
                            color="green"
                            idleText="Learn More!"
                            animation={true}
                            onClick={() => handleSubmit(cell)}
                            />
    }

    const getSchedule = () => {
        console.log(parks);
        if (parks.length > 0) {
            let newSchedule = [];
            newSchedule.push(<BootstrapTable data={parks} striped hover borderRadius="1em" tableStyle={{
                backgroundColor: "white"
            }} bodyStyle={{
                wordBreak: "break-all"
            }}>
            <TableHeaderColumn isKey dataField='states'>State</TableHeaderColumn>
            <TableHeaderColumn dataField='fullName'>Park Name</TableHeaderColumn>
            <TableHeaderColumn dataField='parkCode' overflowY="scroll" width="5em">Code</TableHeaderColumn>
            <TableHeaderColumn dataField='url' dataFormat={buttonFormat} width="10em">Learn More</TableHeaderColumn>
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