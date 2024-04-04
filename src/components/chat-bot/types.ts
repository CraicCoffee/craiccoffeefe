export type ChatMessage = {
  role: 'bot' | 'user';
  content: string;
  extra?: (
    | {
        type: 'metric-chart';
        data: any;
        customConfig?: any;
      }
    | {
        type: 'quick-reply';
        options: string[];
      }
  )[];
};
