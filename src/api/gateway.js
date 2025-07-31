import request from "./request"

export const editHost = async (session_id, agent_name, user_instruction = null) => {
  return await request.post("/edit_host", {
    session_id,
    agent_name,
    user_instruction
  })
}

export const talkToHost = async (session_id, text, motion_dict = {}) => {
  return await request.post("/talk_to_host", {
    session_id,
    text,
    motion_dict
  })
}

export const getSessionReport = async (session_id) => {
  return await request.get(`/session_report/${session_id}`)
}

export const getSessionList = async () => {
  return await request.get("/session_list")
//   return [
//         {
//             session_id: "0",
//             clients: 0,
//             strategy: "mcp_json_reporter"
//         },
//         {
//             session_id: "1",
//             clients: 2,
//             strategy: "tool_selector"
//         },
//         {
//             session_id: "2",
//             clients: 1,
//             strategy: "chain_planner"
//         }
//     ];

}

export const updateAgentSetting = async (session_id, agent_name, new_setting_prompt) => {
  return await request.post(`/agent_setting_update/${session_id}`, null, {
    params: { agent_name, new_setting_prompt }
  })
}

export const addMcpServer = async (session_id, agent_name, url) => {
  return await request.post(`/add_mcp_server/${session_id}`, null, {
    params: { agent_name, url }
  })
}
