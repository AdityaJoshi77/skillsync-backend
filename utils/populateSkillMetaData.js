
const populateSkillMetaData = (skill) => {
    const totalSubmodules_in_skill = skill.modules.reduce((totalSubmodules_in_skill, module)=>{
        return totalSubmodules_in_skill + module.submodules.length;
    }, 0);

    skill.totalSubmodules = totalSubmodules_in_skill;

    skill.modules.forEach(module => {
        module.totalSubmodules = module.submodules.length;
    });
}

module.exports = populateSkillMetaData