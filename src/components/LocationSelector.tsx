import { useState } from 'react';
import '../App.css';

const regionData : {[key: string]: string[]}={
  서울특별시: ['강남구', '강동구', '강북구', '강서구', '관악구', '광진구', '구로구', '금천구'],
  부산광역시: ['중구', '서구', '동구', '영도구', '부산진구'],
  대구광역시: ['중구', '동구', '서구'],
  인천광역시: ['중구', '동구', '미추홀구'],
};

const LocationSelector = () => {
  const [selectedRegion, setSelectedRegion] = useState('서울특별시');
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);

  const handleDistrictChange = (district: string) => {
    setSelectedDistricts(prev =>
      prev.includes(district)
        ? prev.filter(d => d !== district)
        : [...prev, district]
    );
  };

  const handleAllToggle = () => {
    const allDistricts = regionData[selectedRegion];
    if (selectedDistricts.length === allDistricts.length) {
      setSelectedDistricts([]);
    } else {
      setSelectedDistricts(allDistricts);
    }
  };

  return (
    <div className="locationSelector">
      <div className="regionList">
        {Object.keys(regionData).map(region => (
          <div
            key={region}
            className={`regionItem ${region === selectedRegion ? 'active' : ''}`}
            onClick={() => {
              setSelectedRegion(region);
              setSelectedDistricts([]);
            }}
          >
            {region}
          </div>
        ))}
      </div>

      <div className="districtList">
        <div className="districtItem">
          <label>
            <input
              type="checkbox"
              checked={
                selectedDistricts.length === regionData[selectedRegion].length
              }
              onChange={handleAllToggle}
            />
            전체
          </label>
        </div>
        {regionData[selectedRegion].map(district => (
          <div key={district} className="districtItem">
            <label>
              <input
                type="checkbox"
                checked={selectedDistricts.includes(district)}
                onChange={() => handleDistrictChange(district)}
              />
              {district}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LocationSelector;
