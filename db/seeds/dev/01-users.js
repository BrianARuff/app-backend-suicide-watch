
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {username: "brff19", password: "123456", date_of_birth: "02-28-1989", gender: "male", role: "developer", description: "I like making applications that will have an impact on the world. I also like basketball alot.", friends: JSON.stringify(["Betty", "Leslie", "Austin", "Bart", "Beej", "Mohamed Shehab"])},
        {username: "stg81", password: "123456", date_of_birth: "1-1-1981", gender: "male", role: "suspended", description: "I like going to the beach, a lot.", friends: JSON.stringify(["Lindsay", "Doris", "Brian", "Darren", "Logan", "Mahayla"])
        },
        {username: "dtg55", password: "asdf", date_of_birth: "11/15/1955", gender: "female", role: "member", description: "I like games on my phone and taking care of my 88 year old dad.", friends: JSON.stringify(["Shirley", "Shawn", "Brian", "Thomas"])},
        {username: "et80", password: "asdf", date_of_birth: "7/15/1980", gender: "other", role: "banned", description: "I like games on my phone and taking care of my 88 year old dad.", friends: JSON.stringify(["David", "Ellen"])
        },
        {username: "robdogg", password: "RoBDoubleG", date_of_birth: "1/28/1982", gender: "male", role: "admin", description: "I like working, spending time with my children, wife, and family, and playing games on my PlayStation.", friends: JSON.stringify(["Courtney", "Brian", "Shawn", "Doris", "Shirley", "Scott"])}
      ]);
    });
};
