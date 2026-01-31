export default function ManifestationInfo() {
  return (
    <div className="min-h-screen flex items-center justify-center p-">
      <div className="w-full max-w-7xl bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* 3-column grid */}
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-0">

          {/* Left Side – Image (1/3) */}
          <div className="relative h-80 lg:h-auto lg:col-span-3">
            <img
              src="/manifestion.jpg"
              alt="Manifestation Meditation"
              className="w-full h-full object-cover"
            // onError={(e) => {
            //   e.currentTarget.style.display = "none";
            // }}
            />

            {/* Fallback */}
            {/* <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-400 via-pink-300 to-amber-200">
              <div className="text-center p-8">
                <div className="w-56 h-56 mx-auto bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-4 border-white/40">
                  <span className="text-white text-lg font-semibold">
                    Manifestation Image
                  </span>
                </div>
              </div>
            </div> */}
          </div>

          {/* Right Side – Content (2/3) */}
          <div className="lg:col-span-4 p-2 lg:p-5 xl:p-10 bg-gradient-to-br from-gray-50 to-amber-50">
            <h1 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 mb-4 text-center lg:text-left">
              WHAT IS MANIFESTATION?
            </h1>

            <p className="text-md text-gray-900 font-semibold mb-3 leading-relaxed text-center lg:text-left">
              Manifestation is the process of turning your thoughts and beliefs into reality through
              focused intention and aligned action.
            </p>

            <p className="text-md text-gray-900 font-semibold mb-1 leading-relaxed text-center lg:text-left">
              When you focus clearly, believe deeply, and take action, the universe responds.
            </p>

            <div className="rounded-2xl p-4 mb-3">
              <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4 text-center">
                SIMPLY:
              </h2>
              <p className="text-md font-bold text-gray-900 text-center">
                THINK + FEEL + BELIEVE + ACT = MANIFESTATION
              </p>
            </div>

            <div className="space-y-4 mb-5 text-center lg:text-left">
              <p className="text-md text-gray-900 font-bold">
                Scripting / Writing Manifestation is the most powerful form of manifestation.
              </p>

              <p className="text-md text-gray-900 font-semibold">
                Writing is not just words, it is energy in action.
              </p>

              <p className="text-md text-gray-900 font-semibold">
                It works when you write your desires, not just think about them.
              </p>
            </div>

            <div className="bg-gray-900 text-white rounded-2xl p-4 text-center shadow-xl">
              <p className="text-xl font-bold mb-3">
                SO DON'T JUST DREAM IT
              </p>
              <p className="text-xl font-semibold">
                WRITE IT, BELIEVE IT, ACHIEVE IT...
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
