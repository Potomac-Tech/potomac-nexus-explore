const QuickmapModule = () => {
  return (
    <div className="h-full w-full">
      <iframe 
        src="https://quickmap.lroc.im-ldi.com"
        className="w-full h-full border-0"
        title="LROC Quickmap Interactive Lunar Globe"
        allow="geolocation"
      />
    </div>
  );
};

export default QuickmapModule;
