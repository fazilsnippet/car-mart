import http from "k6/http";
import { check } from "k6";

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
  const response = http.get(`${BASE_URL}/users/login`);

  check(response, {
    "status is 200": (r) => r.status === 200,
  });

  if (response.status !== 200) {
    console.log(
      `FAILED REQUEST
STATUS: ${response.status}
BODY: ${response.body}
`
    );
  }
}