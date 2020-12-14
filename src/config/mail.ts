interface IMailConfig {
  driver: 'ethereal' | 'mailgun';

  defaults: {
    from: {
      email: string;
      name: string;
    };
  };
}

export default {
  driver: process.env.MAIL_DRIVER || 'ethereal',

  defaults: {
    from: {
      email: 'diego@rocketseat.com.br',
      name: 'Diego da Rocketseat',
    },
  },
} as IMailConfig;
