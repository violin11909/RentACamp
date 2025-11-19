import { useEffect, useState, useMemo } from "react";
import { GoogleMap, useJsApiLoader, Marker, InfoWindow, Circle } from "@react-google-maps/api";
import "../../index.css";
import { getCampgrounds } from "../../service/campService.js";
import { getRequests } from "../../service/booking.js";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../contexts/AuthContext.jsx';

const defaultCenter = { lat: 13.7563, lng: 100.5018 };
const containerStyle = { width: "100%", height: "100vh", };

function MyGoogleMap() {
  const { user } = useAuth();
  const [campgrounds, setCampgrounds] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [onMouseOverIndex, setOnMouseOverIndex] = useState(null);
  const [selectedCamp, setSelectedCamp] = useState(null);
  const [myBookings, setMyBookings] = useState([]);
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

    const fectchMyBookings = async () => {
      if (user) {
        try {
          const res = await getRequests();
          if (res.success || res.data) {
            setMyBookings(res.data);
          }
        } catch(err) {
          console.error("Failed to fetch bookings", err);
        }
      }
    };
    fetchLocation();
    getAllCampData();
    fectchMyBookings();
  }, [user]);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyB_roEK7oWwe1gChFz9Zd2GxYoylPfdQSs",
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

  const getBookingStatus = (campId) => {
    if (!user || myBookings.length === 0) return null;

    const booking = myBookings.find(b => 
      (b.campgroundId === campId) || (b.campgroundId?._id === campId)
    );

    if (!booking) return null;
    return booking.status;
  };

  const getStatusDisplay = (status) => {
    switch(status) {
      case 'pending': return {text:"รออนุมัติ", color:"text-yellow-600"};
      case 'approved': return {text:"จองสำเร็จแล้ว", color:"text-green-600"};
      case 'declined': return {text:"ถูกปฏิเสธ", color:"text-red-600"};
      default: return null;
    }
  };

  const mapCenter = useMemo(() => {
    if (userLocation) {
      return {lat: userLocation.lat, lng: userLocation.lng};
    }
    return defaultCenter;
  }, [userLocation]);

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

 return (
    <GoogleMap mapContainerStyle={containerStyle} center={mapCenter} zoom={6}>
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

      {campgrounds.map((camp, index) => {
        const status = getBookingStatus(camp._id);
        const statusInfo = getStatusDisplay(status);
        return (
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
                  {statusInfo && (
                    <span className={`font-bold ${statusInfo.color} border borde-gray-200 px-2 py-1 rounded-md bg-gray-50`}>
                      สถานะ: {statusInfo.text}
                    </span>
                  )}
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
        )
      })}
    </GoogleMap>
  );
}

export default MyGoogleMap;
