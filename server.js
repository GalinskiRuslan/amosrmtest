import express from "express";
import axios from "axios";

const app = express();
const port = 3001;

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

// Настройка инстонса axios для работы с amocrm
const $api = axios.create({
  withCredentials: true,
  baseURL: "https://galinskirus.amocrm.ru",
});
$api.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjVkN2JjOTg2ZjU2MDhjMDk0N2Y2NTllNGFjNzZkNzQzNjc4MjQ3OWRhYjc4NWU1ZWRmMzk5ZmVhMDQwOTBmNDVlNzFmNjhhZWUwOWIwYWE1In0.eyJhdWQiOiIyM2UxNWUwMC1hM2QwLTRmNmMtYmRhOS1jYjY0YjcyMzFlOWMiLCJqdGkiOiI1ZDdiYzk4NmY1NjA4YzA5NDdmNjU5ZTRhYzc2ZDc0MzY3ODI0NzlkYWI3ODVlNWVkZjM5OWZlYTA0MDkwZjQ1ZTcxZjY4YWVlMDliMGFhNSIsImlhdCI6MTcyMDYxOTUzOSwibmJmIjoxNzIwNjE5NTM5LCJleHAiOjE3MjUwNjI0MDAsInN1YiI6IjExMjU3NzIyIiwiZ3JhbnRfdHlwZSI6IiIsImFjY291bnRfaWQiOjMxODQxNzI2LCJiYXNlX2RvbWFpbiI6ImFtb2NybS5ydSIsInZlcnNpb24iOjIsInNjb3BlcyI6WyJjcm0iLCJmaWxlcyIsImZpbGVzX2RlbGV0ZSIsIm5vdGlmaWNhdGlvbnMiLCJwdXNoX25vdGlmaWNhdGlvbnMiXSwiaGFzaF91dWlkIjoiOTUwMDNmZTEtNWFlYi00NDdmLWFjZmUtNzc1ZDg5NTcwNTc1In0.BlZN5ZauTRtLAdD60dcIDS0CadGPXe9YSgYKXih0SQg6lZjUYP4a2OvIclb8_HkNeYobaDCXguWpjasLUQv6LQObc9nKHVZiO976-cgo3A6rJlCrPBbcuPbQvVnBGGEjA4j3iiI-SevuW-GcDNDcp0IMzQWXHW_vP_V-5mtBUrygJ4XVtgsNHIsmvsP33yCVfiMV7gmndWcowMxajU7lWf9HM18u4jOhjhXK9J_nqcSA6PUABXGd4twiP5tDVR0g4PW0BrlXhoZyLN5qF2s629OR_qWyu5JumyE8i193ElqcwO6iql4xiV9hxv_idd08Bd7zXxVYzyZ2gCgNvjAtsA`;
  return config;
});

app.get("/getLeads", async (req, res) => {
  const leads = (await $api.get("/api/v4/leads")).data._embedded.leads;
  const pipelines = (await $api.get("/api/v4/leads/pipelines")).data._embedded.pipelines;
  const users = (await $api.get("/api/v4/users")).data._embedded.users;
  const leadsLocal = [];
  for (let i = 0; i < leads.length; i++) {
    let lead = {};
    lead.id = leads[i].id;
    lead.name = leads[i].name;
    lead.group_id = leads[i].group_id;
    lead.price = leads[i].price;
    lead.status = pipelines.find((pipeline) => pipeline.id === leads[i].pipeline_id)._embedded.statuses.find((status) => status.id === leads[i].status_id).name;
    lead.responsible_user = {
      id: users.find((user) => user.id === leads[i].responsible_user_id).id,
      name: users.find((user) => user.id === leads[i].responsible_user_id).name,
      email: users.find((user) => user.id === leads[i].responsible_user_id).email
    },
      lead.pipline = {
        id: pipelines.find((pipeline) => pipeline.id === leads[i].pipeline_id).id,
        name: pipelines.find((pipeline) => pipeline.id === leads[i].pipeline_id).name
      };

    leadsLocal.push(lead);
  }
  res.json([leadsLocal, leads]);
})
