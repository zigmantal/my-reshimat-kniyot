// טיפוסים מינימליים עבור Google Identity Services (נטען דרך תג script ב-index.html)
interface GoogleCredentialResponse {
  credential: string;
  select_by?: string;
}

interface GoogleIdentityAccountsId {
  initialize(config: {
    client_id: string;
    callback: (response: GoogleCredentialResponse) => void;
    auto_select?: boolean;
    itp_support?: boolean;
    use_fedcm_for_prompt?: boolean;
  }): void;
  renderButton(
    parent: HTMLElement,
    options: {
      type?: 'standard' | 'icon';
      theme?: 'outline' | 'filled_blue' | 'filled_black';
      size?: 'large' | 'medium' | 'small';
      text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
      shape?: 'rectangular' | 'pill' | 'circle' | 'square';
      logo_alignment?: 'left' | 'center';
      width?: number | string;
      locale?: string;
    }
  ): void;
  prompt(): void;
}

interface Window {
  google?: {
    accounts: {
      id: GoogleIdentityAccountsId;
    };
  };
}
