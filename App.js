import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View, ScrollView, Dimensions } from 'react-native';
import * as Location from 'expo-location';
import { Fontisto } from '@expo/vector-icons';

const { width : SCREEN_WIDTH } = Dimensions.get('window');
// 추후 보안신경쓰기weather
const API_KEY = "cc2103e5015c2e05f29bdef7e2b857fa";
const icons = {
  "Clouds" : "cloudy",
  "Rain" : "rains",
  "Clear" : "day-sunny",
  "Snow" : "snowflake",
  "Atmosphere" : "cloudy-gusts",
  "Drizzle" : "rain",
  "Thunderstorm" : "lighting"
} 

export default function App() {
  const [city, setCity] = useState("Loading.....");
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);

  const ask = async() => {
    // permission 결과 granted 속성값에 따라 ui 다르게
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if(!granted){
      setOk(false);
    }
    getLocation();
  }

  const getLocation = async()=> {
    const {coords : {latitude, longitude}} = await Location.getCurrentPositionAsync({ accuracy : 5 });
    const location = await Location.reverseGeocodeAsync({latitude, longitude}, {useGoogleMaps : false});
    const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric`);
    const json = await response.json();
    
    setCity(location[0].city);
    setDays(json.daily);
  }

  useEffect(()=>{
    ask();
  }, [])

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView 
        horizontal 
        pagingEnabled 
        showsHorizontalScrollIndicator = { false }
        contentContainerStyle={styles.weather}
      >
        {
          days.length === 0 ? (
            <View style={{...styles.day, alignItems:"center"}}>
              <ActivityIndicator color="black" size="large" />
            </View> 
          )
          : (
            days.map((day, i)=>
              <View style={styles.day} key={i}>
                <View style={{
                  flexDirection:'row', 
                  alignItems:"center",
                  width:"100%",
                }}
                >
                  <Text style={styles.temp}>{parseFloat(day.temp.day).toFixed(1)}</Text>
                  <Fontisto name={icons[day.weather[0].main]} size={55} color="black" marginLeft={15} />
                </View>
                <Text style={styles.description}>{day.weather[0].main}</Text>
                <Text style={styles.tinyText}>{day.weather[0].description}</Text>
              </View>
            )
          )
        }

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1, 
    backgroundColor: "tomato",
  },
  city : {
    flex:1,
    justifyContent:"center",
    alignItems: "center"
  },
  cityName:{
    fontSize: 28,
    fontWeight: "500",
  },

  day : {
    width: SCREEN_WIDTH ,
    paddingHorizontal: 30,
    alignItems:"flex-start",
  },
  temp : {
    marginTop: 50,
    fontSize: 108,
    fontWeight: "700",
  },
  description: {
    marginLeft: 10,
    fontSize: 38,
  },
  tinyText : {
    marginLeft: 10,
    fontSize : 20,
  }
});
