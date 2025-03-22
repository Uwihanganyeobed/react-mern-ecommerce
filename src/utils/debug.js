export const logAuthState = (location, state) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(
      `%c Auth State [${location}] %c`,
      'background: #4338ca; color: white; padding: 2px 4px; border-radius: 3px;',
      '',
      state
    );
  }
}; 