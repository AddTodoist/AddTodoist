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
    message_data: {
      text: string;
      entities: Record<string, unknown>;
    };
  };
}

export { };
