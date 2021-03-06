import React, { useEffect, Component, useState } from "react";
import App from "../App";
import Alert from "react-bootstrap/Alert";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import logo from "../images/updated-logo.PNG";
import { object } from "@hapi/joi";
import { render } from "react-dom";

var newTrip = [];
function TripView() {
  var searchTarget;
  const LogOut = async (event) => {
    event.preventDefault();
    localStorage.removeItem("user_data");
    window.location.href = "/";
  };

  const addTrip = async (event) => {
    event.preventDefault();
    window.location.href = "/AddTripPage";
  };
  var trash = [{ startDate: "0", endDate: "0" }];

  const [tripData, setTripData] = useState([]);
  const [isLoading, setLoading] = useState(true);

  const userObj = localStorage.getItem("user_data");
  const localUser = JSON.parse(userObj);

  var data = { email: localUser.email };
  var js = JSON.stringify(data);

  const array1 = newTrip;
  // Incude fontawesome icon
  // change array.map to tripData.map to test
  
  React.useEffect(() => {
    // To get trip array with ids
    const appName = "onlytrips";
    function buildPathTravel(route) {
      if (process.env.NODE_ENV === "production") {
        return "https://" + appName + ".herokuapp.com/" + route;
      } else {
        return "http://localhost:5000/travel";
      }
    }
    const appName2 = "onlytrips";
    function buildPathSingleTrip(route) {
      if (process.env.NODE_ENV === "production") {
        return "https://" + appName2 + ".herokuapp.com/" + route;
      } else {
        return "http://localhost:5000/singleTrip";
      }
    }

    async function getArrayData() {
      setLoading(true);
      try {
        const request = await fetch(buildPathTravel("travel"), {
          method: "POST",
          body: js,
          headers: { "Content-Type": "application/json" },
        });
        var res = await request.json();
        const newTripID = res.trips;
        // Loop Through array and pass every id to second api
        newTripID.map((trips) => {
          getSingleTripData(trips);
          console.log(newTrip);
        });
        setLoading(false);
      } catch (err) {
        console.log(err);
      }
    }
    async function getSingleTripData(object) {
      var tripInfo;
      var data = { id: object };
      var js = JSON.stringify(data);
      try {
        const request = await fetch(buildPathSingleTrip("singleTrip"), {
          method: "POST",
          body: js,
          headers: { "Content-Type": "application/json" },
        });
        var res = await request.json();

        // Res is my trip
        const singletripData = res.trip;
        tripInfo = JSON.stringify(singletripData);

        // Add to array and set its state
        setTripData(tripData.push(singletripData));
        newTrip.push(singletripData);
      } catch (err) {
        console.log(err);
      }
    }
    getArrayData();
    console.log(newTrip);
  }, []);
  async function doDeleteTrip(tripId) {
    //this.state.error = "";
    const userObj = localStorage.getItem("user_data");
    const localUser = JSON.parse(userObj);
    if (window.confirm("Are you sure you want to delete this trip?")) {
      var obj = {
        email: localUser.email,
        id: tripId,
      };
      var js = JSON.stringify(obj);
      const appName = "onlytrips";
      function buildPathDelete(route) {
        if (process.env.NODE_ENV === "production") {
          return "https://" + appName + ".herokuapp.com/" + route;
        } else {
          return "http://localhost:5000/deleteTrip";
        }
      }

      try {
        const response = await fetch(buildPathDelete("deleteTrip"), {
          method: "POST",
          body: js,
          headers: { "Content-Type": "application/json" },
        });
        var res = await response.text();
        console.log(res);
      } catch (e) {
        return;
      }
    }
    window.location.reload();
  }
  const appName = "onlytrips";
  const searchFunction = async () => {
    var textInput = document.getElementById("searchTarget").value;
    function buildPathSearch(route) {
      if (process.env.NODE_ENV === "production") {
        return "https://" + appName + ".herokuapp.com/" + route;
      } else {
        return "http://localhost:5000/searchTrip";
      }
    }
    var userID = localStorage.getItem("user_data");
    var localUser = JSON.parse(userID);
    var obj = {
      id: localUser.id,
      cityKey: textInput,
    };
    var js = JSON.stringify(obj);
    try {
      const request = await fetch(buildPathSearch("searchTrip"), {
        method: "POST",
        body: js,
        headers: { "Content-Type": "application/json" },
      });
      var res = await request.json();
    } catch (err) {
      console.log(err);
    }

    newTrip = res.user;
    if (res.user.length === 0) console.log("No trip found");
    console.log(newTrip);
  };
  
  async function goUpdate(tripId,num,start,end,c,s) {
    //this.state.error = "";
    localStorage.setItem("trip_data",tripId);
    localStorage.setItem("num_data",num);
    localStorage.setItem("start_data",start);
    localStorage.setItem("end_data",end);
    localStorage.setItem("c_data",c);
    localStorage.setItem("s_data",s);
    window.location.href = "/UpdateTripPage";
  }
  
  
  return (
    <div className="trip-table">
      <div class="container-header">
        <div className="img-div">
          <img src={logo} alt="OnlyTrips Logo" id="navBarLogo"></img>
        </div>
        <div className="search-div">
          <div className="search">
            <input
              id="searchTarget"
              type="text"
              className="searchTerm"
              placeholder="Search"
            />
            <button
              type="submit"
              className="searchButton"
              onClick={searchFunction}
            >
              <i className="fa fa-search"></i>
            </button>
          </div>
        </div>
        <div className="add-div">
          <Button className="addButton" onClick={addTrip}>
            Add
          </Button>
        </div>
        <div className="log-div">
          <Button className="LogOutButton" onClick={LogOut}>
            Logout
          </Button>
        </div>
      </div>
      <div className="trip-tables-generated">
        {isLoading ? (
          <h1>Loading...</h1>
        ) : (
          newTrip.map(
            (trip, index) => (
              console.log(index),
              (
                <div className="TripTable" key={index}>
                  <div className="buttons">
                    <div className="right-icons">
                      <div className="edit-icon" onClick={() => goUpdate(trip._id,trip.numPeople,trip.startDate.split("T")[0],trip.endDate.split("T")[0]),trip.destination[trip.destination.length - 1].city,trip.destination[trip.destination.length - 1].state}>
                        <i className="fa">&#xf044;</i>
                      </div>
                      <div
                        className="delete-icon"
                        onClick={() => doDeleteTrip(trip._id)}
                      >
                        <i className="fa">&#xf014;</i>
                      </div>
                    </div>
              </div>
                    <div className="one">
                      <label>City</label>
                      <input
                        value={
                          trip.destination[trip.destination.length - 1].city
                        }
                      />
                    </div>
                    <div background="inherit" className="one">
                      <label>State</label>
                      <input
                      background="inherit"
                        value={
                          trip.destination[trip.destination.length - 1].state
                        }
                      />
                    </div>
                    <div className="one">
                      <label>Start Date</label>
                      <input width="10%" value={trip.startDate.split("T")[0]} />
                    </div>
                    <div className="one">
                      <label>End Date</label>
                      <input value={trip.endDate.split("T")[0]} />
                    </div>
                    <div className="one">
                      <label>Number of travelers</label>
                      <input value={trip.numPeople} />
                    </div>
                    {/* <td>DELETE ICON</td>
                <td>EDIT ICON</td> */}
                </div>
              )
            )
          )
        )}
      </div>
    </div>
  );
}

export default TripView;
