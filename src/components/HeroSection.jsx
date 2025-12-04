import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function HeroSection() {
  const [banners, setBanners] = useState([]);
  const [addVideo, setAddVideo] = useState()
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
console.log(addVideo,"addVideo")
  useEffect(() => {
    const getBanners = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/user/banners/getBanner/Home`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        ); // fetch JSON from backend [web:21][web:23]
        let res1 = await fetch(
          `${import.meta.env.VITE_API_URL}/api/user/banners/getBanner/Home Refer`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        res1 = await res1.json()

        setAddVideo(res1.data?.mediaUrls[0])
        console.log(res1)// fetch JSON from backend [web:21][web:23]
        const data = await res.json(); // parse JSON [web:22]

        const media = data?.data?.mediaUrls || [];
        console.log(data, "data")
        // normalize into { type, src }
        const normalized = media.map((item) => ({
          type: "video", // "image" | "video"
          src: item,   // URL from backend
        })); // mapping API response for slider data [web:46][web:59]

        setBanners(normalized);
      } catch (err) {
        console.error("Error fetching banners:", err);
      } finally {
        setLoading(false);
      }
    };

    getBanners();
  }, []);

  // auto-slide only when we have banners
  useEffect(() => {
    if (!banners.length) return; // avoid running when empty [web:48]

    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === banners.length - 1 ? 0 : prev + 1
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [banners, currentIndex]);

  const nextSlide = () => {
    if (!banners.length) return;
    setCurrentIndex((prev) =>
      prev === banners.length - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    if (!banners.length) return;
    setCurrentIndex((prev) =>
      prev === 0 ? banners.length - 1 : prev - 1
    );
  };

  if (loading) {
    return (
      <section
      
      // className="w-full bg-cover bg-center py-6" style={{ backgroundImage: "url('/bg.jpg')" }}
      
      >
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-white">Loading banners...</p>
        </div>
      </section>
    );
  }

  if (!banners.length) {
    return (
      <section className="w-full bg-cover bg-center py-6" style={{ backgroundImage: "url('/bg.jpg')" }}>
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-white">No banners available</p>
        </div>
      </section>
    );
  }

  const current = banners[currentIndex];

  return (
    <section
      className="w-full bg-cover bg-center "
    // style={{ backgroundImage: "url('/bg.jpg')" }}
    >
      <div className=" mx-auto  space-y-6">
        <div className="relative rounded-xl overflow-hidden shadow-lg h-[290px] md:h-[500px]">
          {/* {current.type === "image" && (
            <img
              src={current.src}
              alt="banner"
              className="w-full h-full object-cover transition-all duration-700 scale-100"
            />
          )}
{/*  */}

 <img
              src="/slider1.jpeg"
              alt="banner"
              className="w-full h-full object-cover transition-all duration-700 scale-100"
            />
          {/* {current.type === "video" && (
            <video
              src={current.src}
              autoPlay
              loop
              muted
              className="w-full h-full object-cover"
            />
          )}  */}

          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute top-1/2 -translate-y-1/2 left-3 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full"
          >
            <ChevronLeft size={22} />
          </button>

          <button
            onClick={nextSlide}
            className="absolute top-1/2 -translate-y-1/2 right-3 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full"
          >
            <ChevronRight size={22} />
          </button>

          {/* Slide Indicators */}
          <div className="absolute bottom-3 w-full flex justify-center gap-2">
            {banners.map((_, idx) => (
              <div
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-3 h-3 rounded-full cursor-pointer transition ${currentIndex === idx ? "bg-white" : "bg-white/40"
                  }`}
              ></div>
            ))}
          </div>
        </div>
   <div className="relative rounded-xl overflow-hidden shadow-lg h-[290px] md:h-[500px]">  {addVideo&& (
            // <video
            //   src={addVideo}
            //   autoPlay
            //   loop
            //   muted
            //   className="w-full h-full object-cover"
            // />
            <img
              src="/slider2.jpeg"
              alt="banner"
              className="w-full h-full object-cover transition-all duration-700 scale-100"
            />
          )}</div>
      
      </div>
    </section>
  );
}
