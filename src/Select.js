import React from "react"
import bgimg from './img/nationalpark.jpg';
import ReactiveButton from "reactive-button";
import { Modal } from "./Modal";
import { useState } from "react";
import { useHistory } from "react-router";
import { ButtonGroup } from "react-bootstrap";

const Select = () => {

    let history = useHistory();


    return (
        <div>
            <div style={{
                backgroundImage: `url(${bgimg})`,
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                width: '100vw',
                height: '100vh'
            }}>

                <div style={{
                        width: "85vw",
                        display: 'inline-flex',
                        boxSizing: "content-box",
                        justifyContent: "center",
                        alignItems: 'center',
                        marginLeft: '5em',
                        padding: '1em',
                        marginBottom: '2em',
                        backgroundColor: 'green',
                        color: '#fff',
                        boxShadow: '10px 10px 8px #888888',
                        marginTop: '1em'
                    }}>
                    <text alignItems="center">
                        Welcome to the National Parks! You'll be able to find parks based on your selected activities,
                        and you'll be able to view some pictures from parks as well. Remember to have fun when you search
                        and take in all the options you have to coincide with your desires to explore nature! Be appreciative of
                        the parks throughout the U.S. The U.S. National Park Service oversees these parks, so if you want to learn more,
                        click the button below!
                    </text>
                </div>

                <div style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    textAlign: 'center'
                }}>
                    <ReactiveButton
                    buttonState="idle"
                    style={{
                        padding: '1em',
                        borderRadius: '1em',
                        alignSelf: 'center'
                    }}
                    color="green"
                    idleText="About the U.S. National Park Service"
                    animation={true}
                    shadow
                    onClick={() => {window.open("https://www.nps.gov/index.htm")}}
                    />
                </div>

                <br></br>
                <br></br>
                <br></br>
                <br></br>

                <div style={{
                    textAlign: 'center',
                    marginRight: '7em'
                }}>
                    <ButtonGroup style={{
                    }}>
                    <ReactiveButton
                        buttonState="idle"
                        style={{
                            padding: '1em',
                            borderRadius: '1em',
                            alignSelf: 'center',
                            marginRight: '4em',
                            marginLeft: '2em'
                        }}
                        color="#2E8B57"
                        idleText="Search Parks and Activities"
                        animation={true}
                        onClick={() => {history.push("/home")}}
                    />
                    
                    <ReactiveButton
                        buttonState="idle"
                        style={{
                            padding: '1em',
                            borderRadius: '1em',
                            alignSelf: 'center',
                            marginLeft: '5em',
                            marginRight: '3em'
                        }}
                        color="mediumseagreen"
                        idleText="Search Park Images"
                        animation={true}
                        onClick={() => {history.push("/images")}}
                    />
                    </ButtonGroup>
                </div>

            </div>
        </div>
    )
}

export default Select;