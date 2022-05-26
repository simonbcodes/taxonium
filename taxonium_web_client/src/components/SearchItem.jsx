import React, { useEffect } from "react";
import { DebounceInput } from "react-debounce-input";
import { Select } from "./Basic";
import { getDefaultSearch } from "../utils/searchUtil";

const bool_methods = ["and", "or", "not"];
const SearchItem = ({ singleSearchSpec, setThisSearchSpec, config }) => {


  const types = config.search_types ? config.search_types : [];

  let all_amino_acids = "ACDEFGHIKLMNPQRSTVWY".split("");
  all_amino_acids = ["any"].concat(all_amino_acids).concat(["*"]);

  const text_types = ["text_exact", "text_match"];

  const specific_configurations = Object.fromEntries(
    types.map((type) => {
      const obj = {
        method: type.type
      }
      if(type.controls){
        obj.controls = type.controls
      }

      
      return [type.name,obj ]}
    
    )
  );

  const setTypeTo = (type) => {
    setThisSearchSpec({
      ...singleSearchSpec,
      type: type,
      ...specific_configurations[type],
    })
  }

 

  const is_text = text_types.includes(singleSearchSpec.method);

  const is_multi_text = singleSearchSpec.method === "text_per_line";

  /* if this spec type is boolean and it lacks subspecs, add an empty value */
  if (singleSearchSpec.type === "boolean" && !singleSearchSpec.subspecs) {
    singleSearchSpec.subspecs = [];
  }
  /* if this spec type is boolean and it lacks a boolean method, set it to and*/
  if (singleSearchSpec.type === "boolean" && !singleSearchSpec.boolean_method) {
    singleSearchSpec.boolean_method = "and";
  }


  return (
    <>
      <Select
        className="inline-block w-42  border py-1 px-1 text-grey-darkest text-sm mr-1"
        value={singleSearchSpec.type}
        onChange={(e) =>
          setTypeTo(e.target.value)
        }
      >
        {types.map((type) => (
          <option key={type.name} value={type.name}>
            {type.label}
          </option>
        ))}
      </Select>
      {is_text && (
        <DebounceInput
          className="inline-block w-40 border py-1 px-1 text-grey-darkest text-sm"
          value={singleSearchSpec.text}
          onChange={(e) =>
            setThisSearchSpec({
              ...singleSearchSpec,
              text: e.target.value,
            })
          }
        />
      )}
      {is_multi_text && (
        <DebounceInput
          element="textarea"
          className="block w-56 h-32 border py-1 px-1 text-grey-darkest text-sm"
          value={singleSearchSpec.text}
          onChange={(e) =>
            setThisSearchSpec({
              ...singleSearchSpec,
              text: e.target.value,
            })
          }
        />
      )}
      {(is_text || is_multi_text) && singleSearchSpec.controls && (<>
        <label title="Exact match" className="inline-block text-xs text-gray-400 pl-2 pr-3"><input type="checkbox" checked={singleSearchSpec.method === "text_exact" || is_multi_text}
          onChange={(e) => {
            if (e.target.checked) {
              setThisSearchSpec({
                ...singleSearchSpec,
                method: "text_exact",
              });
            } else {
              setThisSearchSpec({
                ...singleSearchSpec,
                method: "text_match",
              });
            }
          }}
        />{" "}
        x </label>
        <label  title="Multi-line"  className="inline-block text-xs text-gray-400">
          <input type="checkbox" checked={is_multi_text}
            onChange={(e) => {
              if (e.target.checked) {
                setThisSearchSpec({
                  ...singleSearchSpec,
                  method: "text_per_line",
                });
              } else {
                setThisSearchSpec({
                  ...singleSearchSpec,
                  method: "text_match",
                });
              }
            }}
          />{" "}
          m </label>
      </>)}
        

      {singleSearchSpec.type === "mutation" && (
        <div className="pl-11 pt-2 text-gray-700">
          <div>
            <label className="text-sm mr-2">Gene: </label>
            <Select
              value={singleSearchSpec.gene}
              onChange={(e) =>
                setThisSearchSpec({ ...singleSearchSpec, gene: e.target.value })
              }
              className="inline-block w-16 border py-1 px-1 text-grey-darkest text-sm h-8"
            >
              {config.genes &&
                config.genes.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
            </Select>
          </div>
          <div className="pt-2">
            <label className="text-sm">Mutation at residue </label>
            <DebounceInput
              type="number"
              value={singleSearchSpec.position}
              onChange={(e) =>
                setThisSearchSpec({
                  ...singleSearchSpec,
                  position: e.target.value,
                })
              }
              className="inline-block w-16 border py-1 px-1 text-grey-darkest text-sm"
            />
            <label className="text-sm">&nbsp;to&nbsp;</label>
            <Select
              value={singleSearchSpec.new_residue}
              onChange={(e) => {
                setThisSearchSpec({
                  ...singleSearchSpec,
                  new_residue: e.target.value,
                });
              }}
              className="inline-block w-16 border py-1 px-1 text-grey-darkest text-sm"
            >
              {all_amino_acids.map((aa) => (
                <option key={aa} value={aa}>
                  {aa}
                </option>
              ))}
            </Select>
            <br />
          </div>
        </div>
      )}
      {(singleSearchSpec.type === "revertant" ||
        singleSearchSpec.type === "mutation") && (
        <div>
          <div className="pl-11 pt-3 text-gray-700">
            <label className="text-sm">with at least&nbsp; </label>
            <DebounceInput
              type="number"
              value={singleSearchSpec.min_tips}
              onChange={(e) =>
                setThisSearchSpec({
                  ...singleSearchSpec,
                  min_tips: e.target.value,
                })
              }
              className="inline-block w-16 border py-1 px-1 text-grey-darkest text-sm"
            />{" "}
            <label className="text-sm">descendants</label>
          </div>
        </div>
      )}
      {singleSearchSpec.type === "boolean" && (
        <>
          <Select
            value={singleSearchSpec.boolean_method}
            onChange={(e) =>
              setThisSearchSpec({
                ...singleSearchSpec,
                boolean_method: e.target.value,
              })
            }
            className="inline-block w-16 border py-1 px-1 text-grey-darkest text-sm mr-1"
          >
            {bool_methods.map((method) => (
              <option key={method} value={method}>
                {method.toUpperCase()}
              </option>
            ))}
          </Select>

          <div className="pl-5 pt-3 border-gray-300 border-solid border-2">
            {singleSearchSpec.subspecs.map((subspec, i) => (
              <div
                key={i}
                // divider style border at bottom
                className="pt-2  border-b-2 border-solid border-grey-light pb-2 mb-2"
              >
                <SearchItem
                  singleSearchSpec={subspec}
                  setThisSearchSpec={(new_subspec) => {
                    setThisSearchSpec({
                      ...singleSearchSpec,
                      subspecs: singleSearchSpec.subspecs.map(
                        (foundsubspec, i) =>
                          i === singleSearchSpec.subspecs.indexOf(subspec)
                            ? new_subspec
                            : foundsubspec
                      ),
                    });
                  }}
                  config={config}
                />
                {/* Deelete button */}
                <button
                  className="text-red-500 text-sm hover:text-red-700 ml-3"
                  onClick={() => {
                    setThisSearchSpec({
                      ...singleSearchSpec,
                      subspecs: singleSearchSpec.subspecs.filter(
                        (compsubspec, i) =>
                          i !== singleSearchSpec.subspecs.indexOf(subspec)
                      ),
                    });
                  }}
                >
                  X
                </button>
              </div>
            ))}
            {/* Add a button to add a new subspec */}
            <button
              className="inline-block w-32 mb-3 border py-1 px-1 text-grey-darkest text-sm"
              onClick={() => {
                setThisSearchSpec({
                  ...singleSearchSpec,
                  subspecs: [...singleSearchSpec.subspecs, getDefaultSearch()],
                });
              }}
            >
              Add sub-search
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default SearchItem;
