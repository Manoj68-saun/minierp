module.exports = (fn) => (req, res, next) => {
    fn(req, res, next)
      .catch((err) => {
        console.error(err);
        res.status(404).json({
          status: 'fail',
          message: err,
        });
      })
      .finally(async () => {
        if (req.dbConnection) {
          try {
            await req.dbConnection.end();
          } catch (err) {
            console.error(err);
          }
        }
      });
  };
  

  