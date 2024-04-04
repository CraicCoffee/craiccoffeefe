// mock/mock.js

export default {
  // 使用 'GET /api/brew' 匹配 GET 请求
  'GET /api/brew': (req, res) => {
    res.status(200).json([
      // 假设数据 - 根据你的数据结构进行调整
      {
        id: 1,
        json: {
          filterCupModel: "Model A",
          cupFactory: "Factory A",
          cupModel: "Cup Model A",
          cupType: "Cup Type A",
          filterPaper: "Filter Paper A",
          beanTypeSelected: "Bean Type A",
          singleBean: {
            name: "Arabica",
            weight: 20,
            bakeDate: "2024-03-01",
            bakeDegree: "Medium"
          },
          mixedBean: {
            blendName: "Espresso Blend",
            beans: [
              { name: "Bean A", percentage: 50 },
              { name: "Bean B", percentage: 50 },
            ],
          },
          fwjl: "10",
          brewingLog: {
            "adc1":
              [
                0.1,
                0.1,
                0.1,
                0.1,
                0.1,
                0.1,
                2.2,
                5.1,
                8.7,
                11.3,
                13.8,
                14.5,
                15.2,
                15.8,
                16.4,
                16.5,
                17,
                17,
                17.5,
                17.5,
                17.7,
                17.8,
                17.9,
                18.3,
                18.3,
                18.7,
                18.8,
                18.9,
                18.9,
                19,
                19.1,
                19.2,
                19.3,
                19.4,
                19.4,
                19.7,
                19.7,
                20.9,
                22.3,
                24.2,
                26.4,
                29.1,
                31.8,
                34.3,
                37.5,
                39.8,
                43,
                45.8,
                49.8,
                52.3,
                56.6,
                60.3,
                64.1,
                68,
                71.3,
                75.6,
                79.6,
                83.1,
                87,
                90.3,
                92.8,
                96.2,
                98.7,
                101.4,
                103.6,
                106.1,
                107.8,
                110,
                112.4,
                115.1,
                117.6,
                120,
                122.7,
                125.7,
                128.6,
                131.5,
                134.2,
                136.5,
                140.2,
                143.5,
                147,
                150.2,
                154.2,
                157.4,
                162,
                165,
                168.2,
                170.4,
                173.3,
                175.8,
                177.9,
                180,
                182.1,
                183.9,
                185.5,
                187.1,
                188.3,
                189.1,
                189.9,
                190.2,
                190.8,
                190.8,
                190.9,
                191,
                191.6,
                191.6,
                191.6,
                191.7,
                191.9,
                191.9,
                191.9,
                192,
                192.1,
                192.1,
                192.2,
                192.2,
                192.2,
                192.3,
                192.4,
                192.4,
                192.5,
                192.5,
                192.5
              ],
            "adc2":
              [
                1.3,
                1.7,
                6.6,
                11.8,
                16.1,
                21.7,
                24.9,
                26.3,
                27.4,
                27.8,
                25.3,
                23.9,
                23.2,
                22.7,
                22.2,
                21.8,
                21.7,
                21.2,
                21.2,
                20.9,
                20.6,
                20.6,
                20.1,
                20.1,
                19.8,
                19.8,
                19.8,
                19.5,
                19.4,
                19.2,
                19.2,
                19.3,
                19.1,
                19.3,
                23.4,
                27.3,
                31.2,
                35.1,
                37.4,
                39.6,
                41.3,
                43.2,
                44.7,
                46,
                46.7,
                47.7,
                48.9,
                49.5,
                50.2,
                50.9,
                51.6,
                52.1,
                52.4,
                53.4,
                53.8,
                54.3,
                54.7,
                55.3,
                55.6,
                56.3,
                57.5,
                58.2,
                57.8,
                54.9,
                52.7,
                50.3,
                51,
                53.8,
                56.4,
                58.6,
                60.2,
                61.9,
                63.8,
                65.1,
                66.3,
                67.5,
                68.7,
                70,
                71.2,
                73,
                74.4,
                75.4,
                76.3,
                76.8,
                75.3,
                71.6,
                68.8,
                65.7,
                63.7,
                60.9,
                58.6,
                56.5,
                54.4,
                52.6,
                50.7,
                49.2,
                47.9,
                46.9,
                46.3,
                45.9,
                45.6,
                45.1,
                45.1,
                44.7,
                44.6,
                44.6,
                44.2,
                44.2,
                44.2,
                44,
                43.8,
                43.8,
                43.8,
                43.8,
                43.7,
                43.5,
                43.4,
                43.4,
                43.4,
                43.3,
                43.3,
                43.2,
                43.3
              ],
            "total":
              [
                1.4,
                1.8,
                6.7,
                11.9,
                16.2,
                21.8,
                27.1,
                31.4,
                36.1,
                39.1,
                39.1,
                38.4,
                38.4,
                38.5,
                38.6,
                38.3,
                38.7,
                38.2,
                38.7,
                38.4,
                38.3,
                38.4,
                38,
                38.4,
                38.1,
                38.5,
                38.6,
                38.4,
                38.3,
                38.2,
                38.3,
                38.5,
                38.4,
                38.7,
                42.8,
                47,
                50.9,
                56,
                59.7,
                63.8,
                67.7,
                72.3,
                76.5,
                80.3,
                84.2,
                87.5,
                91.9,
                95.3,
                100,
                103.2,
                108.2,
                112.4,
                116.5,
                121.4,
                125.1,
                129.9,
                134.3,
                138.4,
                142.6,
                146.6,
                150.3,
                154.4,
                156.5,
                156.3,
                156.3,
                156.4,
                158.8,
                163.8,
                168.8,
                173.7,
                177.8,
                181.9,
                186.5,
                190.8,
                194.9,
                199,
                202.9,
                206.5,
                211.4,
                216.5,
                221.4,
                225.6,
                230.5,
                234.2,
                237.3,
                236.6,
                237,
                236.1,
                237,
                236.7,
                236.5,
                236.5,
                236.5,
                236.5,
                236.2,
                236.3,
                236.2,
                236,
                236.2,
                236.1,
                236.4,
                235.9,
                236,
                235.7,
                236.2,
                236.2,
                235.8,
                235.9,
                236.1,
                235.9,
                235.7,
                235.8,
                235.9,
                235.9,
                235.9,
                235.7,
                235.6,
                235.7,
                235.8,
                235.7,
                235.8,
                235.7,
                235.8
              ],
            "size":
              [
                0,
                0.4,
                4.9,
                5.2,
                4.3,
                5.6,
                5.3,
                4.3,
                4.7,
                3,
                0,
                0,
                0,
                0.1,
                0.1,
                0,
                0.4,
                0,
                0.5,
                0,
                0,
                0.1,
                0,
                0.4,
                0,
                0.4,
                0.1,
                0,
                0,
                0,
                0.1,
                0.2,
                0,
                0.3,
                4.1,
                4.2,
                3.9,
                5.1,
                3.7,
                4.1,
                3.9,
                4.6,
                4.2,
                3.8,
                3.9,
                3.3,
                4.4,
                3.4,
                4.7,
                3.2,
                5,
                4.2,
                4.1,
                4.9,
                3.7,
                4.8,
                4.4,
                4.1,
                4.2,
                4,
                3.7,
                4.1,
                2.1,
                0,
                0,
                0.1,
                2.4,
                5,
                5,
                4.9,
                4.1,
                4.1,
                4.6,
                4.3,
                4.1,
                4.1,
                3.9,
                3.6,
                4.9,
                5.1,
                4.9,
                4.2,
                4.9,
                3.7,
                3.1,
                0,
                0.4,
                0,
                0.9,
                0,
                0,
                0,
                0,
                0,
                0,
                0.1,
                0,
                0,
                0.2,
                0,
                0.3,
                0,
                0.1,
                0,
                0.5,
                0,
                0,
                0.1,
                0.2,
                0,
                0,
                0.1,
                0.1,
                0,
                0,
                0,
                0,
                0.1,
                0.1,
                0,
                0.1,
                0,
                104.8
              ],
            "bsize":
              [
                0,
                0,
                0,
                0,
                0,
                0,
                2.1,
                2.9,
                3.6,
                2.6,
                2.5,
                0.7,
                0.7,
                0.6,
                0.6,
                0.1,
                0.5,
                0,
                0.5,
                0,
                0.2,
                0.1,
                0.1,
                0.4,
                0,
                0.4,
                0.1,
                0.1,
                0,
                0.1,
                0.1,
                0.1,
                0.1,
                0.1,
                0,
                0.3,
                0,
                1.2,
                1.4,
                1.9,
                2.2,
                2.7,
                2.7,
                2.5,
                3.2,
                2.3,
                3.2,
                2.8,
                4,
                2.5,
                4.3,
                3.7,
                3.8,
                3.9,
                3.3,
                4.3,
                4,
                3.5,
                3.9,
                3.3,
                2.5,
                3.4,
                2.5,
                2.7,
                2.2,
                2.5,
                1.7,
                2.2,
                2.4,
                2.7,
                2.5,
                2.4,
                2.7,
                3,
                2.9,
                2.9,
                2.7,
                2.3,
                3.7,
                3.3,
                3.5,
                3.2,
                4,
                3.2,
                4.6,
                3,
                3.2,
                2.2,
                2.9,
                2.5,
                2.1,
                2.1,
                2.1,
                1.8,
                1.6,
                1.6,
                1.2,
                0.8,
                0.8,
                0.3,
                0.6,
                0,
                0.1,
                0.1,
                0.6,
                0,
                0,
                0.1,
                0.2,
                0,
                0,
                0.1,
                0.1,
                0,
                0.1,
                0,
                0,
                0.1,
                0.1,
                0,
                0.1,
                0,
                0
              ],
            "temperature":
              [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                13
              ],
            "thermometer":
              [
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null
              ],
            "percent":
              [
                0,
                0,
                0,
                0,
                0,
                0,
                0.1,
                0.2,
                0.4,
                0.6,
                0.7,
                0.8,
                0.8,
                0.9,
                0.9,
                0.9,
                0.9,
                0.9,
                0.9,
                1,
                1,
                1,
                1,
                1,
                1,
                1,
                1,
                1,
                1,
                1,
                1.1,
                1.1,
                1.1,
                1.1,
                1.1,
                1.1,
                1.1,
                1.1,
                1.2,
                1.3,
                1.4,
                1.5,
                1.7,
                1.8,
                2,
                2.2,
                2.3,
                2.5,
                2.6,
                2.8,
                3,
                3.2,
                3.4,
                3.6,
                3.9,
                4,
                4.3,
                4.5,
                4.7,
                4.9,
                5.1,
                5.2,
                5.4,
                5.5,
                5.7,
                5.8,
                5.9,
                6,
                6.2,
                6.3,
                6.4,
                6.5,
                6.7,
                6.9,
                7,
                7.2,
                7.3,
                7.5,
                7.6,
                7.8,
                8,
                8.2,
                8.4,
                8.6,
                8.8,
                9,
                9.2,
                9.4,
                9.5,
                9.6,
                9.8,
                9.9,
                10,
                10.1,
                10.2,
                10.3,
                10.4,
                10.4,
                10.5,
                10.5,
                10.5,
                10.5,
                10.5,
                10.5,
                10.6,
                10.6,
                10.6,
                10.6,
                10.6,
                10.6,
                10.6,
                10.6,
                10.6,
                10.6,
                10.6,
                10.6,
                10.6,
                10.6,
                10.6,
                10.6,
                10.6,
                10.6,
                10.6
              ],
            "coffeePowerWeight":
              [
                18.1,
                18.1,
                18.1,
                18.1,
                18.1,
                18.1,
                18.1,
                18.1,
                18.1,
                18.1,
                18.1,
                18.1,
                18.1,
                18.1,
                18.1,
                18.1,
                18.1,
                18.1,
                18.1,
                18.1,
                18.1,
                18.1,
                18.1,
                18.1,
                18.1,
                18.1,
                18.1,
                18.1,
                18.1,
                18.1,
                18.1,
                18.1,
                18.1,
                18.1,
                18.1,
                18.1,
                18.1,
                18.1,
                18.1,
                18.1,
                18.1,
                18.1,
                18.1,
                18.1,
                18.1,
                18.1,
                18.1,
                18.1,
                18.1,
                18.1,
                18.1,
                18.1,
                18.1,
                18.1,
                18.1,
                18.1,
                18.1,
                18.1,
                18.1,
                18.1,
                18.1,
                18.1,
                18.1,
                18.1,
                18.1,
                18.1,
                18.1,
                18.1,
                18.1,
                18.1,
                18.1,
                18.1,
                18.1,
                18.1,
                18.1,
                18.1,
                18.1,
                18.1,
                18.1,
                18.1,
                18.1,
                18.1,
                18.1,
                18.1,
                18.1,
                18.1,
                18.1,
                18.1,
                18.1,
                18.1,
                18.1,
                18.1,
                18.1,
                18.1,
                18.1,
                18.1,
                18.1,
                18.1,
                18.1,
                18.1,
                18.1,
                18.1,
                18.1,
                18.1,
                18.1,
                18.1,
                18.1,
                18.1,
                18.1,
                18.1,
                18.1,
                18.1,
                18.1,
                18.1,
                18.1,
                18.1,
                18.1,
                18.1,
                18.1,
                18.1,
                18.1,
                18.1,
                18.1
              ],
            "period": 122,
            "ratio":
              [
                0,
                0,
                0,
                0,
                0,
                0,
                0.1,
                0.2,
                0.4,
                0.6,
                0.7,
                0.8,
                0.8,
                0.9,
                0.9,
                0.9,
                0.9,
                0.9,
                0.9,
                1,
                1,
                1,
                1,
                1,
                1,
                1,
                1,
                1,
                1,
                1,
                1.1,
                1.1,
                1.1,
                1.1,
                1.1,
                1.1,
                1.1,
                1.1,
                1.2,
                1.3,
                1.4,
                1.5,
                1.7,
                1.8,
                2,
                2.2,
                2.3,
                2.5,
                2.6,
                2.8,
                3,
                3.2,
                3.4,
                3.6,
                3.9,
                4,
                4.3,
                4.5,
                4.7,
                4.9,
                5.1,
                5.2,
                5.4,
                5.5,
                5.7,
                5.8,
                5.9,
                6,
                6.2,
                6.3,
                6.4,
                6.5,
                6.7,
                6.9,
                7,
                7.2,
                7.3,
                7.5,
                7.6,
                7.8,
                8,
                8.2,
                8.4,
                8.6,
                8.8,
                9,
                9.2,
                9.4,
                9.5,
                9.6,
                9.8,
                9.9,
                10,
                10.1,
                10.2,
                10.3,
                10.4,
                10.4,
                10.5,
                10.5,
                10.5,
                10.5,
                10.5,
                10.5,
                10.6,
                10.6,
                10.6,
                10.6,
                10.6,
                10.6,
                10.6,
                10.6,
                10.6,
                10.6,
                10.6,
                10.6,
                10.6,
                10.6,
                10.6,
                10.6,
                10.6,
                10.6,
                10.6
              ],
            "scale":
              [
                "1 : 0",
                "1 : 0",
                "1 : 0",
                "1 : 0",
                "1 : 0",
                "1 : 0",
                "1 : 0.1",
                "1 : 0.2",
                "1 : 0.4",
                "1 : 0.6",
                "1 : 0.7",
                "1 : 0.8",
                "1 : 0.8",
                "1 : 0.9",
                "1 : 0.9",
                "1 : 0.9",
                "1 : 0.9",
                "1 : 0.9",
                "1 : 0.9",
                "1 : 1",
                "1 : 1",
                "1 : 1",
                "1 : 1",
                "1 : 1",
                "1 : 1",
                "1 : 1",
                "1 : 1",
                "1 : 1",
                "1 : 1",
                "1 : 1",
                "1 : 1.1",
                "1 : 1.1",
                "1 : 1.1",
                "1 : 1.1",
                "1 : 1.1",
                "1 : 1.1",
                "1 : 1.1",
                "1 : 1.1",
                "1 : 1.2",
                "1 : 1.3",
                "1 : 1.4",
                "1 : 1.5",
                "1 : 1.7",
                "1 : 1.8",
                "1 : 2",
                "1 : 2.2",
                "1 : 2.3",
                "1 : 2.5",
                "1 : 2.6",
                "1 : 2.8",
                "1 : 3",
                "1 : 3.2",
                "1 : 3.4",
                "1 : 3.6",
                "1 : 3.9",
                "1 : 4",
                "1 : 4.3",
                "1 : 4.5",
                "1 : 4.7",
                "1 : 4.9",
                "1 : 5.1",
                "1 : 5.2",
                "1 : 5.4",
                "1 : 5.5",
                "1 : 5.7",
                "1 : 5.8",
                "1 : 5.9",
                "1 : 6",
                "1 : 6.2",
                "1 : 6.3",
                "1 : 6.4",
                "1 : 6.5",
                "1 : 6.7",
                "1 : 6.9",
                "1 : 7",
                "1 : 7.2",
                "1 : 7.3",
                "1 : 7.5",
                "1 : 7.6",
                "1 : 7.8",
                "1 : 8",
                "1 : 8.2",
                "1 : 8.4",
                "1 : 8.6",
                "1 : 8.8",
                "1 : 9",
                "1 : 9.2",
                "1 : 9.4",
                "1 : 9.5",
                "1 : 9.6",
                "1 : 9.8",
                "1 : 9.9",
                "1 : 10",
                "1 : 10.1",
                "1 : 10.2",
                "1 : 10.3",
                "1 : 10.4",
                "1 : 10.4",
                "1 : 10.5",
                "1 : 10.5",
                "1 : 10.5",
                "1 : 10.5",
                "1 : 10.5",
                "1 : 10.5",
                "1 : 10.6",
                "1 : 10.6",
                "1 : 10.6",
                "1 : 10.6",
                "1 : 10.6",
                "1 : 10.6",
                "1 : 10.6",
                "1 : 10.6",
                "1 : 10.6",
                "1 : 10.6",
                "1 : 10.6",
                "1 : 10.6",
                "1 : 10.6",
                "1 : 10.6",
                "1 : 10.6",
                "1 : 10.6",
                "1 : 10.6",
                "1 : 10.6",
                "1 : 10.6"
              ],
            "beanRatioArray":
              [
                0,
                0.1,
                0.2,
                0.5,
                0.8,
                1.1,
                1.4,
                1.6,
                1.9,
                2.1,
                2.2,
                2.1,
                2.1,
                2.1,
                2.1,
                2.1,
                2.1,
                2.1,
                2.1,
                2.1,
                2.1,
                2.1,
                2.1,
                2.1,
                2.1,
                2.1,
                2.1,
                2.1,
                2.1,
                2.1,
                2.1,
                2.1,
                2.1,
                2.1,
                2.2,
                2.5,
                2.7,
                3,
                3.2,
                3.4,
                3.6,
                3.9,
                4.1,
                4.3,
                4.6,
                4.8,
                5,
                5.2,
                5.4,
                5.6,
                5.9,
                6.1,
                6.3,
                6.5,
                6.9,
                7,
                7.3,
                7.5,
                7.8,
                8,
                8.2,
                8.4,
                8.6,
                8.7,
                8.6,
                8.6,
                8.7,
                8.9,
                9.2,
                9.4,
                9.7,
                9.9,
                10.2,
                10.4,
                10.7,
                10.9,
                11.1,
                11.3,
                11.5,
                11.8,
                12.1,
                12.4,
                12.6,
                12.9,
                13.1,
                13.1,
                13.1,
                13.1,
                13.1,
                13.1,
                13.1,
                13.1,
                13.1,
                13.1,
                13,
                13,
                13,
                13,
                13,
                13,
                13.1,
                13,
                13,
                13,
                13,
                13,
                13,
                13,
                13,
                13,
                13,
                13,
                13,
                13,
                13,
                13,
                13,
                13,
                13,
                13,
                13,
                13,
                13
              ],
            "totalBeanRatioArray":
              [
                "1 : 0",
                "1 : 0.1",
                "1 : 0.2",
                "1 : 0.5",
                "1 : 0.8",
                "1 : 1.1",
                "1 : 1.4",
                "1 : 1.6",
                "1 : 1.9",
                "1 : 2.1",
                "1 : 2.2",
                "1 : 2.1",
                "1 : 2.1",
                "1 : 2.1",
                "1 : 2.1",
                "1 : 2.1",
                "1 : 2.1",
                "1 : 2.1",
                "1 : 2.1",
                "1 : 2.1",
                "1 : 2.1",
                "1 : 2.1",
                "1 : 2.1",
                "1 : 2.1",
                "1 : 2.1",
                "1 : 2.1",
                "1 : 2.1",
                "1 : 2.1",
                "1 : 2.1",
                "1 : 2.1",
                "1 : 2.1",
                "1 : 2.1",
                "1 : 2.1",
                "1 : 2.1",
                "1 : 2.2",
                "1 : 2.5",
                "1 : 2.7",
                "1 : 3",
                "1 : 3.2",
                "1 : 3.4",
                "1 : 3.6",
                "1 : 3.9",
                "1 : 4.1",
                "1 : 4.3",
                "1 : 4.6",
                "1 : 4.8",
                "1 : 5",
                "1 : 5.2",
                "1 : 5.4",
                "1 : 5.6",
                "1 : 5.9",
                "1 : 6.1",
                "1 : 6.3",
                "1 : 6.5",
                "1 : 6.9",
                "1 : 7",
                "1 : 7.3",
                "1 : 7.5",
                "1 : 7.8",
                "1 : 8",
                "1 : 8.2",
                "1 : 8.4",
                "1 : 8.6",
                "1 : 8.7",
                "1 : 8.6",
                "1 : 8.6",
                "1 : 8.7",
                "1 : 8.9",
                "1 : 9.2",
                "1 : 9.4",
                "1 : 9.7",
                "1 : 9.9",
                "1 : 10.2",
                "1 : 10.4",
                "1 : 10.7",
                "1 : 10.9",
                "1 : 11.1",
                "1 : 11.3",
                "1 : 11.5",
                "1 : 11.8",
                "1 : 12.1",
                "1 : 12.4",
                "1 : 12.6",
                "1 : 12.9",
                "1 : 13.1",
                "1 : 13.1",
                "1 : 13.1",
                "1 : 13.1",
                "1 : 13.1",
                "1 : 13.1",
                "1 : 13.1",
                "1 : 13.1",
                "1 : 13.1",
                "1 : 13.1",
                "1 : 13",
                "1 : 13",
                "1 : 13",
                "1 : 13",
                "1 : 13",
                "1 : 13",
                "1 : 13.1",
                "1 : 13",
                "1 : 13",
                "1 : 13",
                "1 : 13",
                "1 : 13",
                "1 : 13",
                "1 : 13",
                "1 : 13",
                "1 : 13",
                "1 : 13",
                "1 : 13",
                "1 : 13",
                "1 : 13",
                "1 : 13",
                "1 : 13",
                "1 : 13",
                "1 : 13",
                "1 : 13",
                "1 : 13",
                "1 : 13",
                "1 : 13",
                "1 : 13"
              ]
          },
          beanMoDouJi: "Grinder Model A",
          beanKeDu: "Medium Coarse",
          beanCuXi: "Medium Fine",
          beanBoilDuration: "2:00",
          waterQuality: "Filtered",
          totalWeight: 500,
          waterPowderRatio: "16:1",
          ratio: "1:16",
          totalDuration: 180,
          jugTemperature: "93°C",
          totalWaterInjection: 300,
          bestDrinkTemperature: "65°C",
          stars: 5,
          extraNote: "Tastes best with a slice of lemon.",
          lowercolumn: "Low",
          uppercolumn: "High",
          beforecolumn: "Before",
          aftercolumn: "After",
          ls: "LS Note"
          // ... 其他字段
        },
      },
      // ... 其他 mock 数据对象
    ]);
  },
};