const bcrypt = require('bcryptjs');

// List of doctors with their plain-text passwords
const doctors = [
  { email: 'user1@example.com', password: 'password1' },
  { email: 'user2@example.com', password: 'password2' },
  { email: 'user3@example.com', password: 'password3' },
  { email: 'user4@example.com', password: 'password4' },
  { email: 'user5@example.com', password: 'password5' },
  { email: 'user6@example.com', password: 'password6' },
  { email: 'user7@example.com', password: 'password7' },
  { email: 'user8@example.com', password: 'password8' },
  { email: 'user9@example.com', password: 'password9' },
  { email: 'user10@example.com', password: 'password10' },
  { email: 'user11@example.com', password: 'password11' },
  { email: 'user12@example.com', password: 'password12' },
  { email: 'user13@example.com', password: 'password13' },
  { email: 'user14@example.com', password: 'password14' },
  { email: 'user15@example.com', password: 'password15' },
  { email: 'user16@example.com', password: 'password16' },
  { email: 'user17@example.com', password: 'password17' },
  { email: 'user18@example.com', password: 'password18' },
  { email: 'user19@example.com', password: 'password19' },
  { email: 'user20@example.com', password: 'password20' },
];

const saltRounds = 10;

// Function to hash passwords and generate SQL
const hashPasswords = async () => {
  for (const doctor of doctors) {
    try {
      const hash = await bcrypt.hash(doctor.password, saltRounds);
      console.log(`UPDATE users SET password = '${hash}' WHERE email = '${doctor.email}';`);
    } catch (err) {
      console.error(`Error hashing password for ${doctor.email}:`, err);
    }
  }
};

hashPasswords();
