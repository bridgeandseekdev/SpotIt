function Trial() {
  return (
    <div className="h-screen w-full flex flex-col">
      <div className="h-1/2 flex items-center justify-center bg-gray-100">
        <div className="h-[80%] sm:h-[90%] aspect-square rounded-full bg-blue-400"></div>
      </div>
      <div className="h-1/2 flex items-center justify-center bg-gray-200">
        <div className="h-[80%] sm:h-[90%] aspect-square rounded-full bg-blue-400"></div>
      </div>
    </div>
  );
}

export default Trial;
