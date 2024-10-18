import { useEffect, useRef, useState } from "react";
import regionPaths from "@/util/region.json";

interface SouthKoreaMapProps {
    selectedRegion: string | null;
    setSelectedRegion: (region: string | null) => void;
}

export const SouthKoreaMap = ({ selectedRegion, setSelectedRegion }: SouthKoreaMapProps) => {
    const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
    const [regions, setRegions] = useState([
        "busan", "daegu", "daejeon", "gangwon", "gwangju", "gyeonggi", "incheon", "jeju",
        "north-chungcheong", "north-gyeongsang", "north-jeolla", "sejong", "seoul", "south-chungcheong",
        "south-gyeongsang", "south-jeolla", "ulsan"
    ]);
    const [pendingSelectedRegion, setPendingSelectedRegion] = useState<string | null>(null);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (event: React.MouseEvent<SVGPathElement>, regionId: string) => {
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            setTooltipPosition({
                x: event.clientX - rect.left,
                y: event.clientY - rect.top
            });
        }
        setHoveredRegion(regionId);
    };

    useEffect(() => {
        if (pendingSelectedRegion !== null) {
            const updatedRegions = [
                ...regions.filter(r => r !== pendingSelectedRegion),
                pendingSelectedRegion
            ];
            setRegions(updatedRegions);
            
            // requestAnimationFrame을 사용하여 상태 업데이트를 지연시킵니다.
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setSelectedRegion(pendingSelectedRegion);
                    setPendingSelectedRegion(null);
                });
            });
        }
    }, [pendingSelectedRegion, regions]);
    
    const getRegionPath = (regionId: string) => {
        const region = regionPaths.find(r => r.id === regionId);
        return region ? region.d : '';
    };

    const getRegionStyle = (regionId: string) => {
        const isSelected = selectedRegion === regionId;
        return {
            fill: isSelected ? "#FF0000" : "#A9A9A9",
            transform: isSelected ? "scale(1.1)" : "scale(1)",
            transformOrigin: "center center",
            transition: "all 0.3s ease",
            cursor: "pointer"
        };
    };

    const getRegionName = (regionId: string) => {
        const region = regionPaths.find(r => r.id === regionId);
        return region ? region.title : regionId.charAt(0).toUpperCase() + regionId.slice(1).replace(/-/g, ' ');
    };

    const handleRegionClick = (regionId: string) => {
        if (regionId !== selectedRegion) {
            setPendingSelectedRegion(regionId);
        } else {
            setSelectedRegion(null);
        }
    };

    return (
        <div ref={containerRef} className="h-full w-full relative flex items-center justify-center">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 550 670"
                    aria-label="Map of South Korea"
                    fill="#A9A9A9"
                    className="h-[600px]"
                >
                {regions.map(regionId => (
                    <path
                        key={regionId}
                        id={regionId}
                        name={regionId.charAt(0).toUpperCase() + regionId.slice(1)}
                        d={getRegionPath(regionId)}
                        onClick={() => handleRegionClick(regionId)}
                        onMouseEnter={(e) => handleMouseMove(e, regionId)}
                        onMouseMove={(e) => handleMouseMove(e, regionId)}
                        onMouseLeave={() => setHoveredRegion(null)}
                        style={getRegionStyle(regionId)}
                    />
                ))}
                </svg>
                {hoveredRegion && (
                    <div
                        style={{
                            position: 'absolute',
                            top: `${tooltipPosition.y}px`,
                            left: `${tooltipPosition.x}px`,
                            transform: 'translate(-50%, -100%)',
                            background: 'white',
                            padding: '5px',
                            borderRadius: '4px',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                            pointerEvents: 'none'
                        }}
                    >
                        {getRegionName(hoveredRegion)}
                    </div>
                )}
            </div>
    )
}