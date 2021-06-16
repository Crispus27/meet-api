const advancedResults = (model, populate) => async (req, res, next) => {
	// Pagination
	const page = parseInt(req.query.page, 10) || 1
	const limit = parseInt(req.query.limit, 10) || 20
	const startIndex = (page - 1) * limit
	const endIndex = page * limit
	req.query.page = startIndex
	req.query.limit = limit

	const [[total]] = await model.counts()

	const totalPage = Math.ceil(total.total / limit)

	const [results] = await model.fetchAll(req.query)

	const pagination = {}

	if (endIndex < total) {
		pagination.next = {
			page: page + 1,
			limit,
		}
	}

	if (startIndex > 0) {
		pagination.prev = {
			page: page - 1,
			limit,
		}
	}

	res.advancedResults = {
		success: true,
		count: results.length,
		totalPage,
		pagination,
		data: results,
	}
	next()
}

module.exports = advancedResults
