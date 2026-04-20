
const getRoute = (req: any, res: any) => {
    const { cat, nr, from, to, date: stringDate } = req.params;

    if (!cat) return res.status(400).json({message: "`&cat=`: is required"});
    if (!nr) return res.status(400).json({message: "`&nr=`: is required"});
    if (!from) return res.status(400).json({message: "`&from=`: is required"});
    if (!to) return res.status(400).json({message: "`&to=`: is required"});
    if (!stringDate) return res.status(400).json({message: "`&date=`: is required"});

    const date = new Date(stringDate);
    if(isNaN(date.getTime())) return res.status(400).json({ message: "Invalid date format" });

    //dokonczyc. zawołac tu pkpic.service.getRoute.
}