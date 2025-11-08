import { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import Weather from '../WeatherPage/Weather.jsx';
import { fetchWeather } from '../../service/weather.js';
import { useQuery } from '@tanstack/react-query';
import { useLocation, useNavigate } from "react-router-dom";
import { TiWeatherPartlySunny } from "react-icons/ti";


const Item = ({ icon, detail }) => (
  <li className="flex items-center space-x-3">
    <div className="w-7 aspect-square">
      <img src={icon} alt="icon" className="w-full h-full" />
    </div>
    <p>{detail}</p>
  </li>
);

const Header = ({ img, title }) => (
  <div className="w-full bg-[#224432] p-3 text-white rounded-t-sm flex flex-row gap-2">
    <div className="w-7 aspect-square">
      <img src={img} alt="icon" className="w-full h0full" />
    </div>
    <h2 className="text-lg font-semibold">{title}</h2>
  </div>
);

const ImageSlide = ({ camp, goToSlide, currentIndex }) => {
  if (!camp || !camp.images || camp.images.length === 0) {
    return (
      <div className="lg:col-span-3 relative">
        <div className="rounded-lg w-full h-full bg-gray-300 animate-pulse"></div>
      </div>
    );
  }
  return (
    <div className="lg:col-span-3 relative">
      <img
        src={camp.images[currentIndex]}
        alt="Camping"
        className="rounded-lg transition-transform duration-500 ease-in-out w-full h-full shadow-md"
      />
      {camp.images.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center space-x-2">
          {camp.images.map((_, slideIndex) => (
            <div
              key={slideIndex}
              onClick={() => goToSlide(slideIndex)}
              className={`
              w-3 h-3 rounded-full cursor-pointer transition-all duration-300
              ${currentIndex === slideIndex
                  ? "bg-white scale-110"
                  : "bg-white/50 hover:bg-white/75"
                }
            `}
            ></div>
          ))}
        </div>
      )}
    </div>
  );
};

const Camp = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [checkInTime, setcheckInTime] = useState("");
  const [checkOutTime, setcheckOutTime] = useState("");
  const { state } = useLocation();
  const nav = useNavigate();

  const camp = state?.camp;
  const { data: weather, isLoading: isWeatherLoading, isError: isWeatherError, } = useQuery({
    queryKey: ['weather', camp?._id], queryFn: () => fetchWeather(camp), enabled: !!camp,
  });

  useEffect(() => {
    if (!camp) {
      nav("/map-container");
      return;
    }
    setcheckInTime(`${getThaiTime(camp.startCheckIn)} - ${getThaiTime(camp.endCheckIn)}`);
    setcheckOutTime(getThaiTime(camp.checkOut));
  }, [camp]);

  const goToBookPage = () => {
    nav('/bookpage', { state: { camp } });
  }

  const getInfoItems = () => {
    return [
      { icon: "./src/assets/money.png", detail: `คืนละ ${camp.price} บาท/คน` },
      { icon: "./src/assets/pet.png", detail: camp.petsAllowed ? "สัตว์เลี้ยงเข้าพักได้" : "ไม่อนุญาตสัตว์เลี้ยง" },
      { icon: "./src/assets/clock.png", detail: `เวลาเช็คอิน: ${checkInTime}` },
      { icon: "./src/assets/clock.png", detail: `เวลาเช็คเอาท์: ${checkOutTime}` },
      { icon: "./src/assets/car.png", detail: camp.parking ? "มีที่จอดรถ" : "ไม่มีที่จอดรถ" },
      { icon: "./src/assets/group.png", detail: `จำนวนผู้เข้าพักไม่เกิน ${camp.maxGuests} คน/วัน` },
      { icon: "./src/assets/call.png", detail: camp.tel },
    ];
  }

  const getThaiTime = (time) => {
    const date = new Date(time);
    const thaiDate = new Date(date.getTime());
    const hour = thaiDate.getHours().toString().padStart(2, "0");
    const minute = thaiDate.getMinutes().toString().padStart(2, "0");
    return `${hour}:${minute}`;
  };

  const goToSlide = (slideIndex) => { setCurrentIndex(slideIndex); };

  return (
    <div className="p-5 md:p-7 min-h-screen overflow-auto grid grid-cols-1 md:grid-cols-5 gap-x-5">

      <div className="max-w-5xl bg-white rounded-lg shadow-lg px-10 py-3 relative md:col-span-3 col-span-1">
        <div className="p-6 py-4 pb-3 relative">
          <div
            className="top-3 left-[-30px] absolute hover:bg-gray-200 cursor-pointer rounded-full p-2"
            onClick={() => nav(-1)}  >
            <FaArrowLeft size={30} />
          </div>

          <div className="flex flex-col justify-start">

            <h1 className="text-xl md:text-2xl font-bold text-gray-800 px-2">  {camp.name}   </h1>

            <div className="flex flex-row gap-2 items-center">
              <img
                src="https://iili.io/Kkde2wJ.md.png"
                alt="mark"
                className="w-8 h-8"
              />
              <p className="text-sm text-gray-800">
                {camp.address} {camp.district} {camp.province}{" "}
                {camp.postalcode}
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 pb-4">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <ImageSlide
              camp={camp}
              goToSlide={goToSlide}
              currentIndex={currentIndex}
            />



            <div className="lg:col-span-2 bg-white text-gray-800 shadow-md rounded-sm relative hover:scale-101 hover:shadow-black/40 ease-in-out transition duration-100">
              <Header img="./src/assets/data.png" title="ข้อมูล" />

              <ul className="grid grid-cols-2 lg:grid-cols-1 space-y-4 text-sm px-4 py-3">
                {getInfoItems().map((item, index) => (
                  <Item key={index} icon={item.icon} detail={item.detail} />
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white text-gray-800 mx-6 mb-2 rounded-sm shadow-md hover:scale-101  hover:shadow-black/40 ease-in-out transition duration-100">
          <Header img="./src/assets/info.png" title="รายละเอียด" />
          <p className="text-sm leading-relaxed p-4 pb-5">{camp.detail}</p>
        </div>

        <div className="p-2 py-1 text-center ">
          <button
            className="bg-[#3A6F43] hover:bg-green-900 text-white font-bold py-3 w-1/3 mb-3 rounded-sm  cursor-pointer hover:scale-101  hover:shadow-black/40 ease-in-out transition duration-100"
            onClick={goToBookPage}
          >
            จองเลย
          </button>
        </div>
      </div>


      <div className="col-span-1 md:col-span-2 gap-y-5 overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:hidden z-5 p-3 pt-6 rounded-md bg-[#e4eaf2] text-gray-800 mt-5 min-[880px]:mt-0">
        <div className="text-2xl font-bold mb-4 text-center flex flex-row w-full justify-center gap-5 items-center">
          <TiWeatherPartlySunny size={30}/>
          พยากรณ์อากาศ 5 วัน

        </div>

        {isWeatherLoading && <p className="text-center">กำลังโหลดพยากรณ์อากาศ...</p>}

        {isWeatherError && <p className="text-center text-red-600">ไม่สามารถโหลดข้อมูลอากาศได้</p>}
        {weather && weather.length > 0 && (
          <div> {weather.map((day, index) => (<Weather key={index} day={day} />))}</div>
        )}
      </div>


    </div>
  );
};

export default Camp;
