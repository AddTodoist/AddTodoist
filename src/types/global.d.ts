declare global {
  type URLEntity = {
    url: string,
    expanded_url: string,
    display_url: string,
    indices: [number, number]
  }
  type TWDirectMessage = {
    target: Record<string, unknown>;
    sender_id: string;
    sender_name: string;
    message_data: {
      text: string;
      entities: Record<string, unknown>;
    };
  };
  type DMHandler = (message: TWDirectMessage) => Promise<void>
}

export { };
