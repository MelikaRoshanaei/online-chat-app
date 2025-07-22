export const validateUser = (req, res, next) => {
  let { name, email, password, role = "user" } = req.body;

  if (
    typeof name !== "string" ||
    name !== name.trim() ||
    name.length < 3 ||
    name.length > 100 ||
    !/^[a-zA-Z\s]{3,100}$/.test(name)
  ) {
    return res.status(400).json({ error: "Valid User Name Is Required!" });
  }

  if (
    typeof email !== "string" ||
    email !== email.trim() ||
    email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)
  ) {
    return res.status(400).json({ error: "Valid Email Address Is Required!" });
  }

  if (
    typeof password !== "string" ||
    password !== password.trim() ||
    password.length < 8 ||
    password.length > 64 ||
    !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,64}$/.test(password)
  ) {
    return res.status(400).json({ error: "Valid Password Is Required!" });
  }

  req.body = { name, email, password, role };
  next();
};

export const validateUserLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email) {
    return res
      .status(400)
      .json({ error: "Email is required for email login!" });
  }

  if (
    typeof email !== "string" ||
    email !== email.trim() ||
    email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)
  ) {
    return res
      .status(400)
      .json({ error: "Please Provide a Valid Email Address!" });
  }

  if (!password) {
    return res.status(400).json({ error: "Password is required!" });
  }

  if (
    typeof password !== "string" ||
    password !== password.trim() ||
    password.length < 8 ||
    password.length > 64 ||
    !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,64}$/.test(password)
  ) {
    return res.status(400).json({ error: "Please Provide a Valid Password!" });
  }

  next();
};

export const validateUserUpdate = (req, res, next) => {
  let { name, email, password, role } = req.body;
  let orderIndex = 1;
  let queryFields = [];
  let values = [];

  if (name !== undefined) {
    if (
      typeof name !== "string" ||
      name !== name.trim() ||
      name.length < 3 ||
      name.length > 100 ||
      !/^[a-zA-Z\s]{3,100}$/.test(name)
    ) {
      return res
        .status(400)
        .json({ error: "Please Provide a Valid User Name!" });
    }
    queryFields.push(`name = $${orderIndex}`);
    values.push(name);
    orderIndex++;
  }

  if (email !== undefined) {
    if (
      typeof email !== "string" ||
      email !== email.trim() ||
      email.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)
    ) {
      return res
        .status(400)
        .json({ error: "Please Provide a Valid Email Address!" });
    }
    queryFields.push(`email = $${orderIndex}`);
    values.push(email);
    orderIndex++;
  }

  if (password !== undefined) {
    if (
      typeof password !== "string" ||
      password !== password.trim() ||
      password.length < 8 ||
      password.length > 64 ||
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,64}$/.test(password)
    ) {
      return res
        .status(400)
        .json({ error: "Please Provide a Valid Password!" });
    }
    queryFields.push(`password = $${orderIndex}`);
    values.push(password);
    orderIndex++;
  }

  if (role !== undefined) {
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ error: "Forbidden: Only admins can update role!" });
    }

    if (typeof role !== "string" || !["admin", "user"].includes(role)) {
      return res.status(400).json({ error: "Please Provide a Valid Role!" });
    }
    queryFields.push(`role = $${orderIndex}`);
    values.push(role);
    orderIndex++;
  }

  if (queryFields.length === 0) {
    return res
      .status(400)
      .json({ error: "No Valid Field Provided For Update!" });
  }

  req.validatedData = { queryFields, values };
  next();
};
