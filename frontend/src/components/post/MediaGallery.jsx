import { useEffect, useState } from "react";
import { FaRegPlayCircle } from "react-icons/fa";

export default function MediaGallery({ imageUrls = [] }) {
  const [expandedMedia, setExpandedMedia] = useState(null);

  // Don't render if no media items
  if (!imageUrls || imageUrls.length === 0) return null;

  const processedMedia = imageUrls.map((item) => {
    const isVideo = item.extension == "video" ? true : false;

    return {
      id: item.id,
      url: item.imageUrl,
      type: item.extension == "video" ? "video" : "image",
      extension: item.extension,
      thumbnail: item.imageUrl,
      duration: isVideo ? "0:00" : null,
    };
  });

  // Calculate grid layout based on item count
  const getGridLayout = (count) => {
    if (count === 1) return "grid-cols-1";
    if (count === 2) return "grid-cols-2";
    if (count === 3) return "grid-cols-2 lg:grid-cols-3";
    if (count === 4) return "grid-cols-2 lg:grid-cols-4";
    return "grid-cols-2 md:grid-cols-3 lg:grid-cols-4";
  };

  // Calculate sizes based on count and position
  const getItemClass = (index, count) => {
    // For 3 items, make first item span 2 rows
    if (count === 3 && index === 0) {
      return "row-span-2 col-span-2 md:col-span-1 md:row-span-2";
    }
    // For 5 items, make first item large
    if (count === 5 && index === 0) {
      return "col-span-2 row-span-2";
    }
    return "";
  };

  const handleMediaClick = (index) => {
    setExpandedMedia(expandedMedia === index ? null : index);
  };

  return (
    <div className="relative">
      {/* Normal grid view */}
      <div
        className={`grid ${getGridLayout(processedMedia.length)} gap-2 mb-4`}
      >
        {processedMedia
          .map((media, index) => (
            <div
              key={media.id}
              className={`relative rounded-lg overflow-hidden bg-gray-100 aspect-square cursor-pointer hover:opacity-90 transition-opacity ${getItemClass(
                index,
                processedMedia.length
              )}`}
              onClick={() => handleMediaClick(index)}
            >
              {/* Image */}
              {media.type === "image" && (
                <img
                  src={media.url}
                  alt={`Media ${media.id}`}
                  className="w-full h-full object-cover"
                />
              )}

              {/* Video */}
              {media.type === "video" && (
                <>
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                    {/* Placeholder for video thumbnail */}
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                    <FaRegPlayCircle size={60} />
                  </div>
                </>
              )}

              {/* Count indicator for when we have more than 5 items */}
              {processedMedia.length > 5 && index === 4 && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <div className="text-white text-2xl font-bold">
                    +{processedMedia.length - 5}
                  </div>
                </div>
              )}
            </div>
          ))
          .slice(0, processedMedia.length > 5 ? 5 : processedMedia.length)}
      </div>

      {/* Expanded view modal */}
      {expandedMedia !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="max-w-4xl max-h-full w-full relative">
            <button
              className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center"
              onClick={() => setExpandedMedia(null)}
            >
              ✕
            </button>

            {processedMedia[expandedMedia].type === "image" ? (
              <img
                src={processedMedia[expandedMedia].url}
                alt={`Media ${processedMedia[expandedMedia].id}`}
                className="max-w-full max-h-full object-contain mx-auto"
              />
            ) : (
              <div className="aspect-video w-full bg-black rounded-lg">
                {processedMedia[expandedMedia].url}
                <video controls className="w-full h-full">
                  <source
                    src={processedMedia[expandedMedia].url}
                    type="video/mp4"
                  ></source>
                  Your browser does not support the video tag.
                </video>
              </div>
            )}

            <div className="absolute top-1/2 left-4 right-4 transform -translate-y-1/2 flex justify-between">
              <button
                className="bg-black bg-opacity-50 text-white rounded-full w-10 h-10 flex items-center justify-center"
                onClick={(e) => {
                  e.stopPropagation();
                  setExpandedMedia((prev) =>
                    prev > 0 ? prev - 1 : processedMedia.length - 1
                  );
                }}
              >
                ←
              </button>
              <button
                className="bg-black bg-opacity-50 text-white rounded-full w-10 h-10 flex items-center justify-center"
                onClick={(e) => {
                  e.stopPropagation();
                  setExpandedMedia((prev) =>
                    prev < processedMedia.length - 1 ? prev + 1 : 0
                  );
                }}
              >
                →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
