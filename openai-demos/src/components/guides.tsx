import axios from "axios";
import { useEffect, useState } from "react";
import PromptArea from "./promptarea";
import { IAttractionImage, ICity, ISettings } from "../interfaces";

const Guides = (props: { settings: ISettings }) => {
  const [_, setCount] = useState(0);
  const [cities, setCities] = useState<ICity[]>([]);
  const [city, setCityState] = useState("");
  const [selectedCity, setSelectedCity] = useState<ICity | null>(null);
  const [customLocation, setCustomLocation] = useState({
    city: "",
    country: "",
  });

  const setCity = (city: ICity) => {
    setSelectedCity(null);
    setCityState(city.city);
    setSelectedCity(city);
  };

  const loadCities = async () => {
    let response = await axios.get<ICity[]>("/data/list.json");
    setCities(response.data);
  };

  const selectCustomCity = (city: string, country: string) => {
    const cityObj: ICity = {
      city,
      country,
      airport: "",
      attraction_images: [],
    };
    if (cityObj) {
      setSelectedCity(cityObj);
    }
  };

  useEffect(() => {
    loadCities();
  }, []);

  return (
    <div className="App">
      <section>
        <div className="text-center">
          <h2>World Travel Guides</h2>
        </div>
      </section>
      <div className="container">
        <div className="text-center mb-4">
          <menu>
            <div>
              <section>
                {!selectedCity &&
                  cities
                    .sort((a, b) => {
                      if (a.city.toUpperCase() < b.city.toUpperCase())
                        return -1;
                      if (a.city.toUpperCase() > b.city.toUpperCase()) return 1;
                      return 0;
                    })
                    .map((city) => (
                      <>
                        <button
                          key={city.city}
                          className="btn btn-primary m-2"
                          onClick={() => setCity(city)}
                        >
                          {city.city}
                        </button>
                      </>
                    ))}
                {!selectedCity && (
                  <section>
                    <div className="w50">
                      <div className="input-group mb-3">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="city"
                          aria-label="city"
                          id="custom-city"
                          onChange={(e) => {
                            setCustomLocation({
                              ...customLocation,
                              city: e.target.value,
                            });
                          }}
                        />
                        <input
                          type="text"
                          className="form-control"
                          placeholder="country"
                          id="custom-country"
                          aria-label="country"
                          onChange={(e) => {
                            setCustomLocation({
                              ...customLocation,
                              country: e.target.value,
                            });
                          }}
                        />
                        <button
                          className="btn btn-primary"
                          onClick={() =>
                            selectCustomCity(
                              customLocation.city,
                              customLocation.country
                            )
                          }
                        >
                          Select
                        </button>
                      </div>
                    </div>
                  </section>
                )}
              </section>
            </div>
          </menu>
        </div>

        {selectedCity && (
          <div className="">
            {
              <div className="mb-2">
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => setSelectedCity(null)}
                >
                  Home
                </button>
              </div>
            }
            <div className="text-center fw-bold mb-3">
              <h2 className="">
                {selectedCity.city}, {selectedCity.country}
              </h2>
            </div>
            <hr />

            <div className="row">
              <div className="col-md-4 bg-light">
                <section className="mb-5">
                  <div className="text-center fw-bold h3 mb-3">
                    Main Attractions
                  </div>
                  {selectedCity?.attraction_images.length > 0 ? (
                    <>
                      {selectedCity?.attraction_images.map(
                        (attraction: IAttractionImage, idx: number) => (
                          <div key={idx}>
                            <div className="mb-2">
                              <img
                                className="img-thumbnail"
                                src={attraction.image_url}
                              />
                              {/* <div>{attraction.image_url}</div> */}
                              <div>{attraction.name}</div>
                            </div>
                          </div>
                        )
                      )}
                    </>
                  ) : (
                    <PromptArea
                      settings={props.settings}
                      prompt={
                        "List the main attractions for " +
                        selectedCity.city +
                        " in " +
                        selectedCity.country +
                        "."
                      }
                    />
                  )}
                </section>
                <section className="mb-5 text-normal p-3">
                  <div className="fw-bold h3 mb-3">Safety</div>
                  <PromptArea
                    settings={props.settings}
                    prompt={
                      "What are some threats and safety recommendations for visiting " +
                      selectedCity.city +
                      " in " +
                      selectedCity.country +
                      "?"
                    }
                  />
                </section>
                <section className="mb-5 text-normal p-3">
                  <div className="fw-bold h3 mb-3">Medical Care</div>
                  <PromptArea
                    settings={props.settings}
                    prompt={
                      "How is the medical care and list some medical facilities in" +
                      selectedCity.city +
                      " in " +
                      selectedCity.country +
                      "."
                    }
                  />
                </section>
              </div>
              <div className="col-md-8">
                <section className="mb-5">
                  <div className="fw-bold h3 mb-3">History</div>
                  <PromptArea
                    settings={props.settings}
                    prompt={
                      "Summary of the history of " +
                      selectedCity.city +
                      ", " +
                      selectedCity.country +
                      "?"
                    }
                  />
                </section>
                <section className="mb-5">
                  <div className="fw-bold h3 mb-3">Visa Requirements</div>
                  <PromptArea
                    settings={props.settings}
                    prompt={
                      "What are the VISA requirements to enter " +
                      selectedCity.country +
                      "?"
                    }
                  />
                </section>
                <section className="mb-5">
                  <div className="fw-bold h3 mb-3">Getting To Downtown</div>
                  <PromptArea
                    settings={props.settings}
                    prompt={
                      "What is the closest international airport and what is the best way to get to downtown " +
                      selectedCity.city +
                      ", " +
                      selectedCity.country +
                      "?"
                    }
                  />
                </section>
                <section className="mb-5">
                  <div className="fw-bold h3 mb-3">
                    Public Transportation Options
                  </div>
                  <PromptArea
                    settings={props.settings}
                    prompt={
                      "What are some public transportation options in " +
                      selectedCity.city +
                      ", " +
                      selectedCity.country +
                      "?"
                    }
                  />
                </section>
                <section className="mb-5">
                  <div className="fw-bold h3 mb-3">Local Customs</div>
                  <PromptArea
                    settings={props.settings}
                    prompt={
                      "What are some local customs in " +
                      selectedCity.country +
                      ",  and specifically in " +
                      selectedCity.city +
                      "?"
                    }
                  />
                </section>
                <section className="mb-5">
                  <div className="fw-bold h3 mb-3">Walking Tour</div>
                  <PromptArea
                    settings={props.settings}
                    prompt={
                      "Provide a detailed 4-6 hour walking tour of " +
                      selectedCity.city +
                      ", " +
                      selectedCity.country +
                      "."
                    }
                  />
                </section>
                <section className="mb-5">
                  <div className="fw-bold h3 mb-3">Shopping</div>
                  <PromptArea
                    settings={props.settings}
                    prompt={
                      "List shopping options in " +
                      selectedCity.city +
                      ", " +
                      selectedCity.country +
                      "."
                    }
                  />
                </section>
                <div className="row">
                  <div className="col-md-6">
                    <section className="mb-5">
                      <div className="fw-bold h3">Local Food & Drinks</div>
                      <PromptArea
                        settings={props.settings}
                        prompt={
                          "In " +
                          selectedCity.city +
                          ", " +
                          selectedCity.country +
                          " list up to 5 items of each category of some top dishes, drinks, street food, and desserts?"
                        }
                      />
                    </section>
                  </div>
                  <div className="col-md-6">
                    <section>
                      <div className="fw-bold h3 mb-3">Bars & Restaurants</div>
                      <PromptArea
                        settings={props.settings}
                        prompt={
                          "In " +
                          selectedCity.city +
                          ", " +
                          selectedCity.country +
                          " list of some top bars and restaurants?"
                        }
                      />
                    </section>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <section>
                      <div className="fw-bold h3 mb-3">
                        Beaches and Parks in City
                      </div>
                      <PromptArea
                        settings={props.settings}
                        prompt={
                          "What are some famous beaches and parks in " +
                          selectedCity.city +
                          ", " +
                          selectedCity.country +
                          "?"
                        }
                      />
                    </section>
                  </div>
                  <div className="col-md-6">
                    <section>
                      <div className="fw-bold h3 mb-3">Entertainment</div>
                      <PromptArea
                        settings={props.settings}
                        prompt={
                          "List entertainment options in " +
                          selectedCity.city +
                          ", " +
                          selectedCity.country +
                          "?"
                        }
                      />
                    </section>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Guides;
