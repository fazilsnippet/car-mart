import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  stages: [
    { duration: "10s", target: 10 },
    { duration: "20s", target: 10 },
    { duration: "10s", target: 50 },
    { duration: "20s", target: 50 },
    { duration: "10s", target: 0 },
  ],

  thresholds: {
    http_req_failed: ["rate<0.05"],

    http_req_duration: [
      "p(95)<2000",
      "p(99)<5000",
    ],
  },
};

const BASE_URL = "http://localhost:8001/api";

export default function () {
  const payload = JSON.stringify({
  email: "abdulhameedfazil123@gmail.com",
    password: "11111111Ab",
  });

  const response = http.post(
    `${BASE_URL}/users/login`,
    payload,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  check(response, {
    "status is 200": (r) => r.status === 200,
    "response received": (r) => r.body.length > 0,
  });

  sleep(1);
}

// import http from "k6/http";

// export const options = {
//   vus: 1,
//   iterations: 1,
// };

// const BASE_URL = "http://localhost:8001/api";

// export default function () {
//   const payload = JSON.stringify({
//     email: "abdulhameedfazil123@gmail.com",
//     password: "11111111Ab",
//   });

//   const response = http.post(
//     `${BASE_URL}/auth/login`,
//     payload,
//     {
//       headers: {
//         "Content-Type": "application/json",
//       },
//     }
//   );

//   console.log("================================");
//   console.log(`STATUS: ${response.status}`);
//   console.log(`BODY: ${response.body}`);
//   console.log(`HEADERS: ${JSON.stringify(response.headers)}`);
//   console.log("================================");
// }