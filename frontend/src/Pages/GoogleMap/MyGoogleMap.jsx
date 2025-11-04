import { useEffect, useState } from "react";
import { GoogleMap, useJsApiLoader, Marker, InfoWindow, Circle } from "@react-google-maps/api";
import "../../index.css";
import { getCampgrounds } from "../../service/campService.js";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../contexts/AuthContext.jsx';


const containerStyle = { width: "100%", height: "100vh", };

function MyGoogleMap() {
  const { user } = useAuth();
  const [campgrounds, setCampgrounds] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [onMouseOverIndex, setOnMouseOverIndex] = useState(null);
  const [selectedCamp, setSelectedCamp] = useState(null);
  const center = { lat: 13.7563, lng: 100.5018, };
  const nav = useNavigate();

  useEffect(() => {
    const fetchLocation = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
          };
          console.log("User location :", userLocation);
          setUserLocation(userLocation);

        },
        () => {
          console.error("Error: Geolocation service failed or permission denied.");
          setUserLocation(null)
        }
      );
    }
    fetchLocation();
    getAllCampData();
  }, []);



  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const getAllCampData = async () => {
    const allCampgrounds = await getCampgrounds();
    setCampgrounds(allCampgrounds.data);
    return allCampgrounds;
  };
  const infoOpen = (index, camp) => {
    setOnMouseOverIndex(index);
    setSelectedCamp(camp);
  };

  const infoClose = () => { setOnMouseOverIndex(null); };
  const openCampDetail = () => {
    nav('/camp', { state: { camp: selectedCamp } })
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }


  return (
    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={6}>
      {userLocation && (

        <Marker
          position={userLocation}
          title="ตำแหน่งของคุณ"
          icon={{
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: "#4285F4",
            fillOpacity: 1,
            strokeWeight: 2,
            strokeColor: "white",
          }}
        />

      )}

      {campgrounds.map((camp, index) => (
        <Marker
          key={index}
          position={{ lat: camp.lat, lng: camp.lng }}
          onClick={openCampDetail}
          onMouseOver={() => infoOpen(index, camp)}
          onMouseOut={infoClose}
        >
          {index == onMouseOverIndex && (
            <InfoWindow position={{ lat: camp.lat, lng: camp.lng }}>
              <div className="flex flex-col justify-center items-center p-2 gap-2">
                <h3 className="font-bold text-[18px]">{camp.name}</h3>
                <span className="text-[#05339C]">
                  คลิกเพื่อดูรายละเอียดเพิ่มเติม
                </span>
              </div>
            </InfoWindow>
          )}

          {/* {showDetail && (
            <div className="fixed inset-0 bg-white">
              <Camp camp={selectedCamp} />
            </div>
          )} */}
        </Marker>
      ))}
    </GoogleMap>
  );
}

export default MyGoogleMap;
