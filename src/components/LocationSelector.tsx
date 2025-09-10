import React, { useState, useEffect, useRef } from 'react';

type LocationSelectorProps = {
  onCompleteChange: React.Dispatch<React.SetStateAction<boolean>>;
  onLocationSelect?: (locations: string[]) => void;
  onRegionSelect?: (region: string) => void;
  selectedRegion?: string;
  selectedLocations?: string[];
};

const regionData: { [key: string]: string[] } = {
  서울특별시: ['강남구', '강동구', '강북구', '강서구', '관악구', '광진구', '구로구', '금천구', '노원구', '도봉구', '동대문구', '동작구', '마포구', '서대문구', '서초구', '성동구', '성북구', '송파구', '양천구', '영등포구', '용산구', '은평구', '종로구', '중구', '중랑구'],
  부산광역시: ['중구', '서구', '동구', '영도구', '부산진구', '동래구', '남구', '북구', '해운대구', '사하구', '금정구', '강서구', '연제구', '수영구', '사상구', '기장군'],
  대구광역시: ['중구', '동구', '서구', '남구', '북구', '수성구', '달서구', '달성군'],
  인천광역시: ['중구', '동구', '미추홀구', '연수구', '남동구', '부평구', '계양구', '서구', '강화군', '옹진군'],
  광주광역시: ['동구', '서구', '남구', '북구', '광산구'],
  대전광역시: ['동구', '중구', '서구', '유성구', '대덕구'],
  울산광역시: ['중구', '남구', '동구', '북구', '울주군'],
  세종특별자치시: ['세종시'],
  경기도: ['수원시', '성남시', '고양시', '용인시', '화성시', '부천시', '안산시', '안양시', '남양주시', '평택시', '파주시', '김포시', '광명시', '오산시', '의정부시', '이천시', '안성시', '구리시', '군포시', '하남시', '양주시', '포천시'],
  강원도: ['춘천시', '원주시', '강릉시', '동해시', '태백시', '속초시', '삼척시', '홍천군', '횡성군', '영월군', '평창군', '정선군', '철원군', '화천군', '양구군', '인제군'],
  충청북도: ['청주시', '충주시', '제천시', '보은군', '옥천군', '영동군', '진천군', '괴산군', '음성군', '단양군'],
  충청남도: ['천안시', '공주시', '보령시', '아산시', '서산시', '논산시', '계룡시', '당진시', '금산군', '부여군', '서천군', '청양군', '홍성군', '예산군', '태안군'],
  전라북도: ['전주시', '군산시', '익산시', '정읍시', '남원시', '김제시', '완주군', '진안군', '무주군', '장수군', '임실군', '순창군', '고창군', '부안군'],
  전라남도: ['목포시', '여수시', '순천시', '나주시', '광양시', '담양군', '곡성군', '구례군', '고흥군', '보성군', '화순군', '장흥군', '강진군', '해남군', '영암군', '무안군', '신안군'],
  경상북도: ['포항시', '경주시', '김천시', '안동시', '구미시', '영주시', '영천시', '상주시', '문경시', '경산시', '군위군', '의성군', '청송군', '영양군', '영덕군', '청도군', '고령군', '성주군', '칠곡군'],
  경상남도: ['창원시', '진주시', '통영시', '사천시', '김해시', '양산시', '거제시', '밀양시', '함안군', '창녕군', '고성군', '남해군', '하동군', '산청군', '의령군', '함양군', '거창군', '합천군'],
  제주특별자치도: ['제주시', '서귀포시'],
};

const LocationSelector = ({ onCompleteChange, onLocationSelect, onRegionSelect, selectedRegion: initialRegion, selectedLocations: initialLocations }: LocationSelectorProps) => {
  const [selectedRegion, setSelectedRegion] = useState(initialRegion || '서울특별시');
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>(initialLocations || []);
  const allSelected = selectedDistricts.length === regionData[selectedRegion].length;

  const handleAllToggle = () => {
    if (allSelected) {
      setSelectedDistricts([]);
    } else {
      setSelectedDistricts(regionData[selectedRegion]);
    }
  };
  const handleDistrictChange = (district: string) => {
    if (allSelected) return;

    if (selectedDistricts.includes(district)) {
      setSelectedDistricts(prev => prev.filter(d => d !== district));
    } else {
      if (selectedDistricts.length < 3) {
        setSelectedDistricts(prev => [...prev, district]);
      }
    }
  };


  useEffect(() => {
    onCompleteChange(selectedDistricts.length > 0);
    if (onLocationSelect) {
      const locations = allSelected 
        ? [`${selectedRegion} 전체`]
        : selectedDistricts.map(district => `${selectedRegion} ${district}`);
      onLocationSelect(locations);
    }
  }, [selectedDistricts, selectedRegion, allSelected, onCompleteChange, onLocationSelect]);

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
              if (onRegionSelect) {
                onRegionSelect(region);
              }
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
              checked={allSelected}
              onChange={handleAllToggle}
              disabled={selectedDistricts.length > 0 && !allSelected}
            />
            전체
          </label>
        </div>

        {regionData[selectedRegion].map(district => {
          const disabled = !selectedDistricts.includes(district) && selectedDistricts.length >= 3;
          return (
            <div
              key={district}
              className="districtItem"
              style={{
                opacity: disabled || allSelected ? 0.5 : 1,
                pointerEvents: disabled || allSelected ? 'none' : 'auto',
              }}
            >
              <label>
                <input
                  type="checkbox"
                  checked={selectedDistricts.includes(district)}
                  onChange={() => handleDistrictChange(district)}
                  disabled={disabled || allSelected}
                />
                {district}
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LocationSelector;
